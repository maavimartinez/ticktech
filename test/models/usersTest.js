var users = require('/routes/users');

describe('Users', function () {
    it('retrieves by email', function (done) {
        users.getUserByEMail("test@test.com", function (doc) {
            doc.email.should.equal('test@test.com');
            done();
        });
    });
});