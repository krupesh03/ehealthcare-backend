const asyncHandler = require('express-async-handler');
const db = require('../models/index');
const { QueryTypes } = db.Sequelize;
const User = db.User;
const Qualifications = db.Qualifications;
const constants = require('../constants/constants');

/**
 * @route GET - api/v1/dashboard
 * @desc dashboard api
 */
const dashboardData = asyncHandler( async (req, res) => {

    try {
        var data = {};
        const year = req.query.year ? req.query.year : new Date().getFullYear();
        const month = req.query.month ? req.query.month : (new Date().getMonth() + 1);

        const totalUsers = await db.sequelize.query(`SELECT user_type, count(id) as user_count FROM users WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ? GROUP BY user_type`, {
            replacements: [year, month],
            raw: false,
            type: QueryTypes.SELECT
        });

        const deactiveUsers = await db.sequelize.query('SELECT user_type, count(id) as user_count FROM users WHERE YEAR(deletedAt) = ? AND MONTH(deletedAt) = ? AND deletedAt IS NOT NULL GROUP BY user_type', {
            replacements: [year, month],
            raw: false,
            type: QueryTypes.SELECT
        });

        const activeUsers = await db.sequelize.query('SELECT user_type, count(id) as user_count FROM users WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ? AND deletedAt IS NULL GROUP BY user_type', {
            replacements: [year, month],
            raw: false,
            type: QueryTypes.SELECT
        });

        const qualificationData = await User.findAll({
            attributes: ['qualification', [db.sequelize.fn('COUNT', db.sequelize.col('qualification')), 'doc_cnt']],
            where: {
                user_type: constants.userType.DOCTOR,
                is_admin: 0
            },
            include: [{
                model: Qualifications,
                as: 'qualificationDetails',
                required: true,
                attributes: ['key']
            }],
            group: 'qualification'
        });

        const categoryData = await db.sequelize.query(`SELECT u.doc_category, COUNT(u.doc_category) AS doc_cnt, d.key FROM users u INNER JOIN doctorcategories d ON u.doc_category = d.id AND ( d.deletedAt IS NULL ) WHERE ( u.deletedAt IS NULL AND ( u.user_type = ? AND u.is_admin = 0 )) GROUP BY doc_category`, {
            replacements: [constants.userType.DOCTOR],
            raw: false,
            type: QueryTypes.SELECT
        });

        const genderData = await db.sequelize.query(`select user_type, gender, count(gender) as user_count from users where YEAR(createdAt) = ? and deletedAt is null group by user_type, gender order by user_type, gender DESC`, {
            replacements: [year],
            raw: false,
            type: QueryTypes.SELECT
        });
        
        data.total_users = totalUsers;
        data.deactive_users = deactiveUsers;
        data.active_users = activeUsers;
        data.qualification_data = qualificationData;
        data.category_data = categoryData;
        data.gender_data = genderData;
        res.status(200).json({ status: true, message: 'Data Found', data: data });

    } catch(err) {
        throw new Error(err);
    }
});

module.exports = { dashboardData };