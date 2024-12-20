const asyncHandler = require('express-async-handler');
const bcrypt  = require('bcrypt');
const helperFunctions = require('../helper/helperFunctions');
const db = require('../models/index');
const { Op } = db.Sequelize;
const constants = require('../constants/constants');
const BloodGroups = db.BloodGroups;
const Gender = db.Gender;
const User = db.User;
const Qualifications = db.Qualifications;
const DoctorCategory = db.DoctorCategory;
const PatientAdmissions = db.PatientAdmissions;

/**
 * @route GET /api/v1/user/prefetch 
 * @desc prefetch api
 */
const prefetch = asyncHandler( async (req, res) => {

    try {

        const genders = await Gender.findAll({
            attributes: ['key', 'value']
        });
        const bloodGroups = await BloodGroups.findAll({
            attributes: ['key', 'value']
        });
        const qualifications = await Qualifications.findAll({
            attributes: [['id', 'key'], 'value']
        });
        const doctorCategory = await DoctorCategory.findAll({
            attributes: [['id', 'key'], 'value']
        })
        const data = { 
            bloodGroups : bloodGroups, 
            genders : genders,
            qualifications : qualifications,
            doctorCategory: doctorCategory
        }
        res.status(200).json({ status: true, message: 'Data found', data: data });

    } catch( err ) {
        throw new Error(err);
    }
    
});

/**
 * @route PUT /api/v1/user/update_c
 * @desc update current user api
 */
const updateCurrentUser = asyncHandler(async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { first_name, last_name, mobile_number, gender, blood_group, address, profile_picture } = req.body;
        if( !first_name || !last_name || !mobile_number || !gender ) {
            res.status(400);
            if( !first_name ) {
                throw new Error('First name is mandatory');
            }
            if( !last_name ) {
                throw new Error('Last name is mandatory');
            }
            if( !mobile_number ) {
                throw new Error('Mobile number is mandatory');
            }
            if( !gender ) {
                throw new Error('Gender is mandatory');
            }
        }
        if( mobile_number.toString().length !== 10 || isNaN(mobile_number) ) {
            res.status(400);
            throw new Error('Invalid Mobile number');
        }
        const updateData = { first_name, last_name, mobile_number, gender, blood_group, address, profile_picture, updated_by : req.user.id };
        const user = await User.update(updateData, {
            where: {
                id: req.user.id
            }
        });
        t.commit();
        res.status(200).json({ status: true, message: 'Details updated successfully', data: user });
    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route POST /api/v1/user/uploadpic
 * @desc upload profile pic
 */
const uploadProfilePic = asyncHandler( async (req, res) => {

    try {
        const destFolderName = constants.profilePicFolder;
        const fieldname = 'avatar';
        const upload = helperFunctions.uploadFileFunction(destFolderName, fieldname);
        upload( req, res, (err) => {
            if( err ) {
                return res.status(400).json({ status: false, message: err, data: [] });
            }
            const filePath = req.file.path;
            res.status(200).json({ status: true,  message: "Profile pic uploaded succesfully", data: { filename: filePath } });
        });
    } catch (err) {
        throw new Error(err);
    }
});

/**
 * @route POST /api/v1/user/addDoctor
 * @desc add new doctor api
 */
const addDoctor = asyncHandler (async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { first_name, last_name, email, password, cpassword, mobile_number, birth_date, age, gender, blood_group, qualification, doc_category, address } = req.body;
        if( !first_name || !last_name || !email || !password || !mobile_number || !gender || !qualification || !doc_category ) {
            res.status(400);
            if( !first_name ) {
                throw new Error('First name is mandatory');
            }
            if( !last_name ) {
                throw new Error('Last name is mandatory');
            }
            if( !email ) {
                throw new Error('Email is mandatory');
            }
            if( !password ) {
                throw new Error('Password is mandatory');
            }
            if( !mobile_number ) {
                throw new Error('Mobile number is mandatory');
            }
            if( !gender ) {
                throw new Error('Gender is mandatory');
            }
            if( !qualification ) {
                throw new Error('Qualification is mandatory');
            }
            if( !doc_category ) {
                throw new Error('Doctor category is mandatory');
            }
        }
        if( !email.match(constants.emailValidateRegex) ) {
            res.status(400);
            throw new Error('Invalid Email address');
        }
        if( await User.findOne({ attributes: ['id'], where: { email: email} }) ) {
            res.status(400);
            throw new Error('Email already exists');
        }
        if( password.length  < 10 ) {
            res.status(400);
            throw new Error('Password length should not be less than 10 characters');
        }
        if( password !== cpassword ) {
            res.status(400);
            throw new Error('Password and confirm password does not match');
        }
        if( mobile_number.toString().length !== 10 || isNaN(mobile_number) ) {
            res.status(400);
            throw new Error('Invalid Mobile number');
        }
        if( await User.findOne({ attributes: ['id'], where: {mobile_number: mobile_number} }) ) {
            res.status(400);
            throw new Error('Mobile number already exists')
        }
        if( birth_date ) {
            if( new Date(birth_date).getTime() > new Date().getTime() ) {
                res.status(400);
                throw new Error('Invalid Birth Date');
            }
        }
        if( age ) {
            if( isNaN(age) ) {
                res.status(400);
                throw new Error('Invalid age');
            }
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const postData = {
            first_name, last_name, email, password : hashedPassword, mobile_number, birth_date, age, gender, user_type : constants.userType.DOCTOR, blood_group, qualification, doc_category, address, created_by : req.user.id, updated_by: req.user.id 
        }
        const doctor = await User.create(postData);
        doctor.setDataValue('password', null);
        t.commit();
        res.status(201).json({ status: true, message: 'Doctor added successfully', data: doctor });
    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route GET /api/v1/user/getDoctors
 * @desc get doctors list api
 */
const getDoctors = asyncHandler( async (req, res) => {
    try {
        const perPage = Number(req.query.per_page);
        var page = req.query.page ? Number(req.query.page) - 1 : 0
        page = page * perPage;
        var whereCond = {};
        const searchQuery = req.query.search_query;
        if( searchQuery ) {
            whereCond = {
                [Op.or] : [
                    { first_name : {[Op.like] : `%${searchQuery}%`} },
                    { last_name : {[Op.like] : `%${searchQuery}%`} },
                    { email : {[Op.like] : `%${searchQuery}%`} },
                    { mobile_number : {[Op.like] : `%${searchQuery}%`} }
                ]
            }
        }
        whereCond.user_type = constants.userType.DOCTOR;
        whereCond.is_admin = 0;
        const doctors = await User.findAndCountAll({
            attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'email', 'mobile_number', 'birth_date', 'age', 'gender', 'user_type', 'blood_group', 'qualification', 'doc_category', 'address', 'createdAt', 'updatedAt', 'deletedAt'],
            include: [{
                model: Qualifications,
                required: true, //to make inner join
                as: 'qualificationDetails',
                attributes: ['id', 'key', 'value']
            }, {
                model: DoctorCategory,
                required: true, //to make inner join
                as: 'doctorCategoryDetails',
                attributes: ['id', 'key', 'value']
            }],
            where: whereCond,
            order: [
                ['id', 'DESC']
            ],
            limit: perPage,
            offset: page,
            paranoid: false //use this when need to fetch soft deleted record also
        });
        const totalPages = Math.ceil(doctors.count / perPage);
        if( doctors.count == 0 ){
            res.status(400);
            throw new Error('No Doctors Found');
        }
        doctors.total_pages = totalPages;
        res.status(200).json({ status: true, message: 'Data Found', data: doctors });
    } catch( err ) {
        throw new Error(err);
    }
});

/**
 * @route GET /api/v1/user/getDoctor/:id
 * @desc get doctor api
 */
const getDoctor = asyncHandler( async (req, res) => {
    try {
        const doctor = await User.findOne({
            attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'email', 'mobile_number', 'birth_date', 'age', 'gender', 'blood_group', 'qualification', 'doc_category', 'address', 'createdAt','updatedAt', 'deletedAt'],
            include: [{
                model: Qualifications,
                as: 'qualificationDetails',
                required: true,
                attributes: ['id', 'key', 'value']
            }, {
                model: DoctorCategory,
                required: true,
                as: 'doctorCategoryDetails',
                attributes: ['id', 'key', 'value']
            }],
            where: {
                id: req.params.id,
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            },
            //raw: true
        });
        if (!doctor) {
            res.status(400);
            throw new Error('No Doctor Found');
        }
        res.status(200).json({ status: true, message: 'Data Found', data: doctor });
    } catch(err){
        throw new Error(err);
    }
});

/**
 * @route PUT /api/v1/user/updateDoctor/:id
 * @desc update user api
 */
const updateDoctor = asyncHandler( async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { first_name, last_name, email, mobile_number, birth_date, age, gender, blood_group, qualification, doc_category, address } = req.body;
        if( !first_name || !last_name || !email || !mobile_number || !gender || !qualification || !doc_category ) {
            res.status(400);
            if( !first_name ) {
                throw new Error('First name is mandatory');
            }
            if( !last_name ) {
                throw new Error('Last name is mandatory');
            }
            if( !email ) {
                throw new Error('Email is mandatory');
            }
            if( !mobile_number ) {
                throw new Error('Mobile number is mandatory');
            }
            if( !gender ) {
                throw new Error('Gender is mandatory');
            }
            if( !qualification ) {
                throw new Error('Qualification is mandatory');
            }
            if( !doc_category ) {
                throw new Error('Doctor category is mandatory');
            }
        }
        if( !email.match(constants.emailValidateRegex) ) {
            res.status(400);
            throw new Error('Invalid Email address');
        }
        if( await User.findOne({ attributes: ['id'], where: { id: { [db.Sequelize.Op.ne]: req.params.id }, email: email} }) ) {
            res.status(400);
            throw new Error('Email already exists');
        }
        if( mobile_number.toString().length !== 10 || isNaN(mobile_number) ) {
            res.status(400);
            throw new Error('Invalid Mobile number');
        }
        if( await User.findOne({ attributes: ['id'], where: { id: { [db.Sequelize.Op.ne]: req.params.id }, mobile_number: mobile_number} }) ) {
            res.status(400);
            throw new Error('Mobile number already exists')
        }
        if( birth_date ) {
            if( new Date(birth_date).getTime() > new Date().getTime() ) {
                res.status(400);
                throw new Error('Invalid Birth date');
            }
        }
        if( age ) {
            if( isNaN(age) ) {
                res.status(400);
                throw new Error('Invalid age');
            }
        }
        const updateData = { first_name, last_name, email, mobile_number, birth_date, age, gender, blood_group, qualification, doc_category, address, updated_by: req.user.id };
        const doctor = await User.update(updateData, {
            where: {
                id: req.params.id,
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            }
        });
        t.commit();
        res.status(200).json({ status: true, message: "Doctor details updated successfully", data: doctor });
    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route DELETE /api/v1/user/deleteDoctor/:id
 * @desc delete user api
 */
const deleteDoctor = asyncHandler( async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const doctor = await User.findOne({
            where: {
                id: req.params.id,
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            }
        });
        if( !doctor ) {
            res.status(400);
            throw new Error('Doctor does not exist');
        }
        const deleteDoctor = await User.destroy({
            where: {
                id: req.params.id,
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            }
        });
        t.commit();
        res.status(200).json({ status: true, message: 'Doctor deactivated successfully', data: deleteDoctor });
    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route PUT /api/v1/user/restoreDoctor/:id
 * @desc restore user api
 */
const restoreDoctor = asyncHandler( async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const doctor = await User.findOne({
            attributes: ['id', 'deletedAt'],
            where: {
                id: req.params.id,
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            },
            paranoid: false
        });
        if( !doctor ) {
            res.status(400);
            throw new Error('Doctor does not exist');
        }
        if( !doctor.deletedAt ) {
            res.status(400);
            throw new Error('This doctor is not deactivated');
        }
        const restoreDoctor = await User.restore({
            where: {
                id: req.params.id,
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            }
        });
        t.commit();
        res.status(200).json({ status: true, message: 'Doctor activated successfully', data: restoreDoctor });
    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route POST /api/v1/user/patient
 * @desc api to add patient
 */
const addPatient = asyncHandler( async (req, res) => {

    const t = await db.sequelize.transaction();
    try {
        const { first_name, last_name, email, password,  cpassword, mobile_number, birth_date, age, gender, blood_group, address, admission_date } = req.body;
        if( !first_name || !last_name || !email || !password || !gender || !blood_group || !admission_date ) {
            res.status(400);
            if( !first_name ) {
                throw new Error('First name is mandatory');
            }
            if( !last_name ) {
                throw new Error('Last name is mandatory');
            }
            if( !email ) {
                throw new Error('Email is mandatory');
            }
            if( !password ) {
                throw new Error('Password is mandatory');
            }
            if( !gender ) {
                throw new Error('Gender is mandatory');
            }
            if( !blood_group ) {
                throw new Error('Blood Group is mandatory');
            }
            if( !admission_date ) {
                throw new Error('Admission date is mandatory');
            }
        }
        if( !email.match(constants.emailValidateRegex) ) {
            res.status(400);
            throw new Error('Invalid Email address');
        }
        if( await User.findOne({ attributes: ['id'], where: { email: email } }) ) {
            res.status(400);
            throw new Error('Email address already exists');
        }
        if( password.length < 10 ) {
            res.status(400);
            throw new Error('Password length should not be less than 10 characters');
        }
        if( password !== cpassword ) {
            res.status(400);
            throw new Error('Password and confirm password does not match');
        }
        if( mobile_number ) {
            res.status(400);
            if( mobile_number.toString().length !== 10 || isNaN(mobile_number) ) {
                throw new Error('Invalid Mobile number');
            }
            if( await User.findOne( { attributes: ['id'], where: { mobile_number: mobile_number} } ) ) {
                throw new Error('Mobile number already exists');
            }
        }
        if( new Date(admission_date).getTime() > new Date().getTime() ) {
            res.status(400);
            throw new Error('Admission date cannot be greater than current date');
        }
        if( birth_date ) {
            if( new Date(birth_date).getTime() > new Date().getTime() ) {
                res.status(400);
                throw new Error('Invalid Birth date');
            }
        }
        if( age ) {
            if( isNaN(age) ) {
                res.status(400);
                throw new Error('Invalid Age');
            }
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const patient = await User.create({
            first_name, last_name, email, password : hashedPassword, mobile_number, birth_date, age, gender, user_type : constants.userType.PATIENT, blood_group, address, created_by : req.user.id, updated_by: req.user.id,
            patient_admissions: {
                admission_date
            }
        }, {
            include: [User.Patient] 
        });
        patient.setDataValue('password', null);
        t.commit();
        res.status(200).json({ status: true, message: "Patient created successfully", data: patient });
    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route GET /api/v1/user/patient
 * @desc api to get all patients
 */
const getPatients = asyncHandler( async (req, res) => {

    try {
        const perPage = Number(req.query.per_page);
        var page = req.query.page ? Number(req.query.page) - 1 : 0;
        page = perPage * page;
        var searchQuery = req.query.search_query;
        var whereCond = {};
        if ( searchQuery ) {
            searchQuery = searchQuery.trim();
            whereCond = {
                [Op.or] : [
                    { first_name : { [Op.like] : `%${searchQuery}%` } },
                    { last_name : { [Op.like] : `%${searchQuery}%` } },
                    { email : { [Op.like] : `%${searchQuery}%` } },
                    { mobile_number : { [Op.like] : `%${searchQuery}%` } }
                ]
            }
        }
        whereCond.user_type = constants.userType.PATIENT;
        whereCond.is_admin = 0;
        const patients = await User.findAndCountAll({
            attributes: { exclude: ['password', 'qualification', 'doc_category'] },
            where: whereCond,
            include:[{
                model: PatientAdmissions,
                as: 'patient_admissions',
                attributes: ['id', 'patient_id', 'admission_date']
            }],
            order: [
                ['id', 'DESC']
            ],
            limit: perPage,
            offset: page,
            paranoid: false
        });
        const totalPages = Math.ceil( patients.count / perPage );
        if ( patients.count == 0 ) {
            res.status(400);
            throw new Error('No Patients found');
        }
        patients.total_pages = totalPages;
        res.status(200).json({ status: true, message: 'Data Found', data: patients });
    } catch(err) {
        throw new Error(err);
    }

});

/**
 * @route GET /api/v1/user/patient/:id
 * @desc api to get specific patient
 */
const getPatient = asyncHandler( async (req, res) => {
    try {
        const patient = await User.findOne({
            attributes: { exclude: ['password', 'qualification', 'doc_category'] },
            where: {
                id : req.params.id,
                user_type : constants.userType.PATIENT,
                is_admin: 0
            },
            include: [{
                model: PatientAdmissions,
                as: 'patient_admissions',
                attributes: ['id', 'patient_id', 'admission_date']
            }]
        });
        if ( !patient ) {
            res.status(400);
            throw new Error('No Patient Found');
        }
        res.status(200).json({ status: true, message: 'Data Found', data: patient })

    } catch(err){
        throw new Error(err);
    }
});

/**
 * @route PUT /api/v1/user/patient/:id
 * @desc api to update patient
 */
const updatePatient = asyncHandler( async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { first_name, last_name, email, mobile_number, birth_date, age, gender, blood_group, address, admission_date } = req.body;
        if( !first_name || !last_name || !email || !gender || !blood_group || !admission_date ) {
            res.status(400);
            if( !first_name ) {
                throw new Error('First name is mandatory');
            }
            if( !last_name ) {
                throw new Error('Last name is mandatory');
            }
            if( !email ) {
                throw new Error('Email is mandatory');
            }
            if( !gender ) {
                throw new Error('Gender is mandatory');
            }
            if( !blood_group ) {
                throw new Error('Blood Group is mandatory');
            }
            if( !admission_date ) {
                throw new Error('Admission date is mandatory');
            }
        }
        if( !email.match(constants.emailValidateRegex) ) {
            res.status(400);
            throw new Error('Invalid email address');
        }
        if( await User.findOne({ attributes: ['id'], where: { email: email, id: { [Op.ne] : req.params.id } } }) ) {
            res.status(400);
            throw new Error('Email address already exists');
        }
        if( mobile_number ) {
            if( mobile_number.toString().length !== 10 || isNaN(mobile_number) ) {
                res.status(400);
                throw new Error('Invalid Mobile number');
            }
            if( await User.findOne({ attributes: ['id'], where: { mobile_number: mobile_number, id: { [Op.ne] : req.params.id } } }) ) {
                res.status(400);
                throw new Error('Mobile number alreay exists');
            }
        }
        if( new Date(admission_date).getTime() > new Date().getTime() ) {
            res.status(400);
            throw new Error('Admission date cannot be greater than current date');
        }
        if( birth_date ) {
            if( new Date(birth_date).getTime() > new Date().getTime() ) {
                res.status(400);
                throw new Error('Invalid Birth date');
            }
        }
        if( age ) {
            if( isNaN(age) ) {
                res.status(400);
                throw new Error('Invalid Age');
            }
        }
        const updateData = { first_name, last_name, email, mobile_number, birth_date, age, gender, blood_group, address, updated_by: req.user.id };
        const patient = await User.update(updateData, {
            where: {
                id: req.params.id,
                user_type: constants.userType.PATIENT,
                is_admin: 0
            }
        });
        const patientAdmissionDate = await PatientAdmissions.findOne({
            attributes: ['admission_date'],
            where: {
                patient_id: req.params.id,
                admission_date: admission_date
            }
        });
        if( !patientAdmissionDate ) {
            await PatientAdmissions.destroy({
                where: {
                    patient_id: req.params.id
                }
            });
            await PatientAdmissions.create({
                patient_id: req.params.id,
                admission_date: admission_date
            });
        }
        t.commit();
        res.status(200).json({ status: true, message: 'Patient updated successfully', data : patient });

    } catch( err ) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route DELETE - api/v1/user/patient/:id
 * @desc api to delete patient
 */
const deletePatient = asyncHandler( async (req, res) => {

    const t = await db.sequelize.transaction();
    try {
        var whereCond = {
            id: req.params.id,
            is_admin: 0,
            user_type: constants.userType.PATIENT
        };
        const patient = await User.findOne({
            where: whereCond 
        });
        if( !patient ) {
            res.status(400);
            throw new Error('Patient does not exist');
        }
        const deletePatient = await User.destroy({
            where: whereCond
        });
        t.commit();
        res.status(200).json({ status: true, message: 'Patient deactivated successfully', data: deletePatient });

    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

/**
 * @route PUT - api/v1/user/patient/:id
 * @desc api to restore patient
 */
const restorePatient = asyncHandler( async (req, res) => {

    const t = await db.sequelize.transaction();
    try {
        var whereCond = {
            id: req.params.id,
            is_admin: 0,
            user_type: constants.userType.PATIENT
        }
        const patient = await User.findOne({
            attributes: ['deletedAt'],
            where: whereCond,
            paranoid: false
        });
        if( !patient ) {
            res.status(400);
            throw new Error('Patient does not exist');
        }
        if( !patient.deletedAt ) {
            res.status(400);
            throw new Error('Patient is not deactivated');
        }
        const restorePatient = await User.restore({
            where: whereCond
        });
        t.commit();
        res.status(200).json({ status: true, message: 'Patient activated successfully', data: restorePatient });

    } catch(err) {
        t.rollback();
        throw new Error(err);
    }
});

module.exports = { prefetch, 
                    updateCurrentUser, 
                    uploadProfilePic, 
                    addDoctor, 
                    getDoctors, 
                    getDoctor, 
                    updateDoctor,
                    deleteDoctor,
                    restoreDoctor,
                    addPatient,
                    getPatients,
                    getPatient,
                    updatePatient,
                    deletePatient,
                    restorePatient 
                };
