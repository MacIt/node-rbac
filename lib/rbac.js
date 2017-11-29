/**
 * @copyright ©2017 HongYuan All Rights Reserved.
 * @author Xubiao on 25/11/2017.
 * @fileoverview
 */
var mysql = require('./mysql');

var rbac = function(config) {
    var mysqlConn = mysql(config);
    return mysqlConn;
}

module.exports = rbac;

