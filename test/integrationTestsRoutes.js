var server = require('supertest');
var should = require('chai').should();
var expect  = require('chai').expect;
var app = require('../src/app.js');

describe('Integration Test cases for apis', function () {

    describe('Integration Test cases for apis', function () {

        it('ITC_001- Testing main page /', function (done) {
            server(app)
                .get('/')
                .expect('Content-Type', /text/)
                .expect(200)
                .end((err) => {
                if (err) return done(err);
                done();
            });
        });

        it('ITC_002- Testing file api /file', function (done) {
            server(app)
                .get('/file')
                .expect('Content-Type', 'application/octet-stream')
                .expect('Content-Disposition', 'attachment; filename=data.txt')
                .expect(200)
                .end((err) => {
                if (err) return done(err);
                done();
            });
        });

        it('ITC_003- Testing product api /product', function (done) {
            server(app)
                .get('/product?param1=10&param2=5')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err,res) => {
                if (err) return done(err);
                JSON.parse(res.text).Product.should.equal(50);
                done();
            });
        });

        it('ITC_004- Testing negative scenrio of product api /product', function (done) {
            server(app)
                .get('/product?param=10&param5=5')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err,res) => {
                if (err) return done(err);
                JSON.parse(res.text).Error.should.equal('param1 & param2 required for product');
                done();
            });
        });
    
        it('ITC_005- Testing finding first non repeated character api /repeating', function (done) {
            server(app)
                .get('/repeating?input=aassertyrf')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err,res) => {
                if (err) return done(err);
                JSON.parse(res.text).FirstNonRepeatingCharacter.should.equal('e');
                done();
            });
        });

        it('ITC_006- Testing finding first non repeated character api /repeating negative scenario', function (done) {
            server(app)
                .get('/repeating')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err,res) => {
                if (err) return done(err);
                JSON.parse(res.text).Error.should.equal('Input param required for processing');
                done();
            });
        });

        it('ITC_007- Testing upload api /upload', function (done) {
            server(app)
                .get('/upload')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err,res) => {
                if (err) return done(err);
                done();
            });
        });

        it('ITC_008- Testing non suported url /asdf will be routed to main page', function (done) {
            server(app)
                .post('/asdf')
                .expect('Content-Type', /text/)
                .expect(200)
                .end((err,res) => {
                if (err) return done(err);
                done();
            });
        });
    
    });//ITC describe ends here...
});