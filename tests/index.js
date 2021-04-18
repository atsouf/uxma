import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';



const { expect } = chai;


chai.use(chaiHttp);

describe('Test for upload endpoint', () => {
    describe('Test for POST route', () => {
        it('should return 201 and create user with single file upload', async() => {
            const res = await chai.request(app)
                .post('/upload')
                .set('content-type', 'multipart/form-data')
                .attach('file', fs.readFileSync(`${__dirname}/file.png`), 'tests/file.png')
                expect(res.status).to.equal(201);
                console.log('RES',res.body.data)
        })
    })

})

    describe('Test for delete endpoint', () => {
        describe('Test for POST route', () => {
            it('should return 201 and create user with single image upload', async() => {
                const res = await chai.request(app)
                    .post('/delete_file')
                    .field('file', 'text.txt')
                expect(res.status).to.equal(201);
                console.log('RES',res.body.data)
            })
        })
    })


describe('Test for user endpoint', () => {
    describe('Test for POST route', () => {
        it('should return 201 and create user with single image upload', async() => {
            const res = await chai.request(app)
                .post('/users')
                .set('content-type', 'multipart/form-data')
                .field('textNew', 'test')
                .field('TextOld', 'Lorem')
                .field('textFile', 'text.txt')

            expect(res.status).to.equal(201);
            console.log('RES',res.body.data)
        })
    })
})
