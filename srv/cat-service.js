const cds = require('@sap/cds')


module.exports = cds.service.impl(srv => {
    srv.before('READ', ['Layout'], req => {
        console.log(req.user);
    })
})
