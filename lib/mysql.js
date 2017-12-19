/**
 * @copyright ©2017 HongYuan All Rights Reserved.
 * @author Xubiao on 26/11/2017.
 * @fileoverview
 */
// 'use strict'
var moment = require('moment');
var mysql = require('promise-mysql');

module.exports = function (config) {
    var _this = this;
    _this.pool = mysql.createPool(config.mysql);
    _this.rbacConfig = config.rbac;

    _this.query = function (sql) {
        return _this.pool.getConnection()
            .then(function (connection) {
                var result = connection.query(sql);
                _this.pool.releaseConnection(connection);
                return result;
            })
            .catch(function (err) {
                console.log(err);
                return err;
            })
    }
    _this.queryPermissionByResource = function (action, resource) {
        var sql = 'SELECT `permission_id` FROM ' + _this.rbacConfig.permission_table + ' WHERE `permission_action`=' +
            _this.pool.escape(action) + ' AND `permission_route`=' + _this.pool.escape(resource) + ' LIMIT 0, 1';
        return _this.query(sql)
            .then(function (rows) {
                return rows[0];
            });
    }

    _this.queryPermissionForUser = function (userId, action, resource) {
        if (!userId) {
            return Promise.reject('userId不能为空');
        }
        if (!action) {
            return Promise.reject('action不能为空');
        }
        if (!resource) {
            return Promise.reject('resource不能为空');
        }
        return _this.queryPermissionByResource(action, resource)
            .then(function (row) {
                var permissionId = row.permission_id;
                /*var joinSQL = 'SELECT * FROM ' + _this.rbacConfig.user_role + ' ur INNER JOIN ' + _this.rbacConfig.role_permission + ' rp ON'
                    + ' ur.role_id = rp.role_id WHERE ur.user_id=' + _this.pool.escape(userId) + ' AND rp.permission_id=' + _this.pool.escape(permissionId);*/
                var joinSQL = 'SELECT * FROM ' + _this.rbacConfig.user_table + ' user INNER JOIN ' + _this.rbacConfig.role_permission + ' rp ON'
                    + ' user.t_zhijie_user_role_id = rp.role_id WHERE user.t_zhijie_user_id=' + _this.pool.escape(userId) +
                    ' AND rp.permission_id=' + _this.pool.escape(permissionId);
                return _this.query(joinSQL);
            })
    }

    _this.queryPermissionsForUser = function (userId) {
        if (!userId) {
            return Promise.reject('userId不能为空');
        }
        var joinSQL = 'SELECT pm.* FROM ' + _this.rbacConfig.user_table + ' user INNER JOIN '
            + _this.rbacConfig.role_permission + ' rp INNER JOIN ' + _this.rbacConfig.permission_table + ' pm ON'
            + ' user.t_zhijie_user_role_id = rp.role_id AND rp.permission_id = pm.permission_id WHERE user.t_zhijie_user_id=' + _this.pool.escape(userId);
        return _this.query(joinSQL);

    }

    _this.addRole = function (roleName, roleDescription) {
        if (!permissionData.role_name) {
            return Promise.reject('role_name不能为空');
        }

        var roleSql = 'INSERT INTO ' + _this.rbacConfig.role_table + ' SET role_name=' + _this.pool.escape(roleName) +
            ', role_description=' + _this.pool.escape(roleDescription) + ', role_createtime="' + moment().format('YYYY-MM-DD HH:mm:ss') + '"';

        return _this.query(roleSql);
    }

    _this.addPermission = function (permissionData) {
        if (!permissionData.permission_name) {
            return Promise.reject('permission_name不能为空');
        }
        if (!permissionData.permission_action) {
            return Promise.reject('permission_action不能为空');
        }
        if (!permissionData.permission_resource) {
            return Promise.reject('permission_resource不能为空');
        }
        var roleSql = 'INSERT INTO ' + _this.rbacConfig.permission_table + ' SET permission_name=' + _this.pool.escape(permissionData.permission_name) +
            ', permission_action=' + _this.pool.escape(permissionData.permission_action) + ', permission_resource=' + _this.pool.escape(permissionData.permission_resource) +
            ', permission_description=' + _this.pool.escape(permissionData.permission_description) + ', permission_createtime="' + moment().format('YYYY-MM-DD HH:mm:ss') + '"';

        return _this.query(roleSql);
    }
    return {
        hasPermission: _this.queryPermissionForUser,
        permissionsForUser: _this.queryPermissionsForUser,
        addRole: _this.addRole,
        addPermission: _this.addPermission
    }
}