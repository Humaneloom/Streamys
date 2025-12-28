import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userRelated/userSlice';
import { studentReducer } from './studentRelated/studentSlice';
import { noticeReducer } from './noticeRelated/noticeSlice';
import { sclassReducer } from './sclassRelated/sclassSlice';
import { teacherReducer } from './teacherRelated/teacherSlice';
import { complainReducer } from './complainRelated/complainSlice';
import doubtReducer from './doubtRelated/doubtSlice';
import interactionReducer from './interactionRelated/interactionSlice';
import calendarReducer from './calendarRelated/calendarSlice';
import { marksheetReducer } from './marksheetRelated/marksheetSlice';
import bookReducer from './bookRelated/bookSlice';
import bookLoanReducer from './bookLoanRelated/bookLoanSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        student: studentReducer,
        teacher: teacherReducer,
        notice: noticeReducer,
        complain: complainReducer,
        sclass: sclassReducer,
        doubt: doubtReducer,
        interaction: interactionReducer,
        calendar: calendarReducer,
        marksheet: marksheetReducer,
        books: bookReducer,
        bookLoans: bookLoanReducer
    },
});

export default store;
