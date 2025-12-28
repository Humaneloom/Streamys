// Conditional import for Razorpay (fallback if not installed)
let Razorpay;
try {
    Razorpay = require('razorpay');
} catch (error) {
    console.warn('Razorpay package not found. Install with: npm install razorpay');
    Razorpay = null;
}
const crypto = require('crypto');
const StudentFee = require('../models/studentFeeSchema');
const PaymentHistory = require('../models/paymentHistorySchema');
const Student = require('../models/studentSchema');

// Initialize Razorpay instance (only if package is available)
let razorpay = null;
if (Razorpay) {
    console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'Found' : 'Not found');
    console.log('Razorpay Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Found' : 'Not found');
    
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
    });
    
    console.log('Razorpay initialized successfully');
}

// Create Razorpay order
const createPaymentOrder = async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(503).json({ 
                success: false,
                message: 'Payment gateway not configured. Please install Razorpay: npm install razorpay' 
            });
        }

        const { 
            studentId, 
            studentFeeId, 
            amount, 
            paymentMethod = 'Online',
            description 
        } = req.body;

        // Verify student and fee record
        const student = await Student.findById(studentId);
        const studentFee = await StudentFee.findById(studentFeeId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!studentFee) {
            return res.status(404).json({ message: 'Student fee record not found' });
        }

        // Validate amount
        if (amount <= 0 || amount > studentFee.pendingAmount) {
            return res.status(400).json({ 
                message: 'Invalid payment amount',
                maxAmount: studentFee.pendingAmount 
            });
        }

        // Create Razorpay order
        const orderOptions = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `fee_${Date.now().toString().slice(-8)}`, // Keep receipt under 40 chars
            notes: {
                studentId: studentId,
                studentFeeId: studentFeeId,
                studentName: student.name,
                rollNumber: student.rollNum,
                paymentFor: 'School Fee Payment',
                description: description || `Fee payment for ${student.name}`
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        // Store order details temporarily (you might want to create a separate schema for this)
        const orderData = {
            razorpayOrderId: order.id,
            studentId,
            studentFeeId,
            amount: amount,
            paymentMethod,
            status: 'Created',
            createdAt: new Date()
        };

        console.log('Razorpay order created:', order.id);

        res.status(201).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            },
            orderData,
            student: {
                name: student.name,
                rollNum: student.rollNum,
                email: student.email || `${student.rollNum}@school.edu`
            }
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create payment order',
            error: error.message 
        });
    }
};

// Verify Razorpay payment and update records
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            studentId,
            studentFeeId,
            amount,
            paymentMethod
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment signature verification failed'
            });
        }

        // Get payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        
        if (payment.status === 'captured') {
            // Update student fee record
            const studentFee = await StudentFee.findById(studentFeeId);
            if (!studentFee) {
                return res.status(404).json({ message: 'Student fee record not found' });
            }

            const paidAmount = amount;
            studentFee.paidAmount = (studentFee.paidAmount || 0) + paidAmount;
            studentFee.lastPaymentDate = new Date();
            await studentFee.save();

            // Create payment history record
            const paymentRecord = new PaymentHistory({
                student: studentId,
                studentFee: studentFeeId,
                school: studentFee.school,
                amount: paidAmount,
                paymentMethod: paymentMethod || 'Razorpay',
                transactionId: razorpay_payment_id,
                paymentGateway: 'Razorpay',
                paymentStatus: 'Success',
                paymentDate: new Date(payment.created_at * 1000), // Razorpay timestamp is in seconds
                description: `Online fee payment via Razorpay - Order: ${razorpay_order_id}`,
                academicYear: studentFee.academicYear || new Date().getFullYear().toString(),
                // Store additional Razorpay details
                gatewayResponse: {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    method: payment.method,
                    bank: payment.bank,
                    wallet: payment.wallet,
                    vpa: payment.vpa
                }
            });

            await paymentRecord.save();

            // Get updated fee details
            const updatedFee = await StudentFee.findById(studentFeeId)
                .populate('student', 'name rollNum')
                .populate('sclassName', 'sclassName');

            console.log('Payment verified and recorded:', razorpay_payment_id);

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment: {
                    id: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    amount: paidAmount,
                    status: 'Success'
                },
                updatedFee,
                paymentRecord: paymentRecord._id
            });

        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not captured',
                paymentStatus: payment.status
            });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// Handle payment failure
const handlePaymentFailure = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            error_code,
            error_description,
            studentId,
            studentFeeId
        } = req.body;

        console.log('Payment failed:', {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            error: error_description
        });

        // Optionally store failed payment attempts
        // You can create a separate schema for failed payments if needed

        res.status(200).json({
            success: false,
            message: 'Payment failed',
            error: error_description
        });

    } catch (error) {
        console.error('Error handling payment failure:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment failure',
            error: error.message
        });
    }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await razorpay.payments.fetch(paymentId);

        res.status(200).json({
            success: true,
            payment: {
                id: payment.id,
                orderId: payment.order_id,
                amount: payment.amount / 100, // Convert from paise to rupees
                status: payment.status,
                method: payment.method,
                createdAt: new Date(payment.created_at * 1000)
            }
        });

    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment status',
            error: error.message
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentStatus
};