/**
 * @copyright ©2017 HongYuan All Rights Reserved.
 * @author Xubiao on 25/11/2017.
 * @fileoverview
 */
const rbac = require('./lib/rbac.js')({
    mysql: {
        host: '101.200.49.138',
        user: 'root',
        password: 'biaoxu',
        database: 'zhijie'
    },
    rbac: {
        'user_table': 't_zhijie_user',
        'role_table': 't_zhijie_role',
        'user_role': 't_zhijie_user_role_relation',
        'permission_table': 't_zhijie_permission',
        'role_permission': 't_zhijie_role_permission_relation',
    }
});

var result = rbac.hasPermission(1, 'create', '/crew/customer/switch')
    .then(function(result) {
        if(result.length > 0) {
            console.log(true);
        }
    });

rbac.permissionsForUser(1)
    .then(function(result) {
        console.log(result);
    });

/*rbac.addRole('Super Admin', '超级管理员')
    .then(function(res) {
        console.log(res.insertId);
    })
    .catch(function(err) {
        console.log(err.errno);
    });*/
/*rbac.addPermission({
    permission_name: '添加车辆',
    permission_action: 'create',
    permission_resource: '/add/car',
    permission_description: 'sdfd'
})
    .then(function(res) {
        console.log(res.insertId);
    })
    .catch(function(err) {
        console.log(err);
    });*/

