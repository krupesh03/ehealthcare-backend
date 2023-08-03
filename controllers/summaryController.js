const asyncHandler = require('express-async-handler');
const db = require('../models/index');
const { QueryTypes } = db.Sequelize;

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

        const deactivatedUsers = await db.sequelize.query('SELECT user_type, count(id) as user_count FROM users WHERE YEAR(deletedAt) = ? AND MONTH(deletedAt) = ? AND deletedAt IS NOT NULL GROUP BY user_type', {
            replacements: [year, month],
            raw: false,
            type: QueryTypes.SELECT
        });

        const activatedUsers = await db.sequelize.query('SELECT user_type, count(id) as user_count FROM users WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ? AND deletedAt IS NULL GROUP BY user_type', {
            replacements: [year, month],
            raw: false,
            type: QueryTypes.SELECT
        });
        
        data.total_users = totalUsers;
        data.deactivated_users = deactivatedUsers;
        data.activated_users = activatedUsers;
        res.status(200).json({ status: true, message: 'Data Found', data: data });

    } catch(err) {
        throw new Error(err);
    }
});

module.exports = { dashboardData };