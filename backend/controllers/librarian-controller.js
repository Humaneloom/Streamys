const Librarian = require('../models/librarianSchema.js');
const Admin = require('../models/adminSchema.js');

const librarianRegister = async (req, res) => {
    try {
        console.log('Librarian registration request body:', req.body);
        console.log('School name in request:', req.body.schoolName);
        
        const librarian = new Librarian({
            ...req.body
        });

        const existingLibrarianByEmail = await Librarian.findOne({ email: req.body.email });

        if (existingLibrarianByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await librarian.save();
            console.log('Librarian saved successfully:', result);
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        console.error('Librarian registration error:', err);
        res.status(500).json(err);
    }
};

const librarianLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let librarian = await Librarian.findOne({ email: req.body.email });
        if (librarian) {
            if (req.body.password === librarian.password) {
                librarian.password = undefined;
                res.send(librarian);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getLibrarianDetail = async (req, res) => {
    try {
        let librarian = await Librarian.findById(req.params.id);
        if (librarian) {
            librarian.password = undefined;
            res.send(librarian);
        }
        else {
            res.send({ message: "No librarian found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateLibrarian = async (req, res) => {
    try {
        let librarian = await Librarian.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        if (librarian) {
            librarian.password = undefined;
            res.send(librarian);
        }
        else {
            res.send({ message: "No librarian found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getLibrarians = async (req, res) => {
    try {
        console.log('Getting librarians for school:', req.params.id);
        
        // First, let's see ALL librarians in the database
        let allLibrarians = await Librarian.find({});
        console.log('ALL librarians in database:', allLibrarians);
        
        // Fix any librarians with wrong school name (temporary fix)
        if (req.params.id === 'KLPD') {
            await Librarian.updateMany(
                { schoolName: 'Sample School' },
                { $set: { schoolName: 'KLPD' } }
            );
            console.log('Fixed librarian school names');
        }
        
        // Now get librarians for the specific school
        let librarians = await Librarian.find({ schoolName: req.params.id });
        console.log('Librarians for school', req.params.id, ':', librarians);
        
        if (librarians.length > 0) {
            librarians.forEach(librarian => {
                librarian.password = undefined;
            });
            res.send(librarians);
        }
        else {
            // Return empty array instead of object with message
            res.send([]);
        }
    } catch (err) {
        console.error('Error getting librarians:', err);
        res.status(500).json(err);
    }
};

const deleteLibrarian = async (req, res) => {
    try {
        let librarian = await Librarian.findByIdAndDelete(req.params.id);
        if (librarian) {
            res.send({ message: "Librarian deleted successfully" });
        }
        else {
            res.send({ message: "No librarian found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteLibrarians = async (req, res) => {
    try {
        let result = await Librarian.deleteMany({ schoolName: req.params.id });
        if (result.deletedCount > 0) {
            res.send({ message: `${result.deletedCount} librarians deleted successfully` });
        }
        else {
            res.send({ message: "No librarians found to delete" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getLibraryDashboardData = async (req, res) => {
    try {
        const schoolName = req.params.id;
        
        // Get total librarians count
        const totalLibrarians = await Librarian.countDocuments({ schoolName });
        
        // Get librarians by department (if you want to categorize them)
        const librariansByDepartment = await Librarian.aggregate([
            { $match: { schoolName } },
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        
        // Get recent librarians (last 5 added)
        const recentLibrarians = await Librarian.find({ schoolName })
            .sort({ _id: -1 })
            .limit(5)
            .select('name email department createdAt');
        
        const dashboardData = {
            totalLibrarians,
            librariansByDepartment,
            recentLibrarians,
            schoolName
        };
        
        res.send(dashboardData);
    } catch (err) {
        console.error('Error getting library dashboard data:', err);
        res.status(500).json(err);
    }
};

module.exports = {
    librarianRegister,
    librarianLogIn,
    getLibrarianDetail,
    updateLibrarian,
    getLibrarians,
    deleteLibrarian,
    deleteLibrarians,
    getLibraryDashboardData
};
