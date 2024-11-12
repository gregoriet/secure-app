const request = require('supertest');
const app = require('./app');

describe('Test de Seguretat i Integració', () => {

let token = '';

// Test de registre
it('hauria de registrar un nou usuari', async () => {
const res = await request(app)
.post('/register')
.send({ username: 'usuari', password: 'Contrasenya123' });

expect(res.statusCode).toEqual(201);
expect(res.text).toBe('Usuari registrat amb èxit');
});

// Test d'inici de sessió
it("hauria d'iniciar sessió i obtenir un token", async () => {
const res = await request(app)
.post('/login')
.send({ username: 'usuari', password: 'Contrasenya123' });

expect(res.statusCode).toEqual(200);
expect(res.body.token).toBeDefined();
token = res.body.token; // Guardem el token per a usar-lo en altres tests
});

// Test d'accés a recurs protegit sense token
it("hauria de bloquejar l'accés sense token", async () => {
const res = await request(app)
.get('/protected');

expect(res.statusCode).toEqual(401); // Codi d'error per no autenticat
});

// Test d'accés a recurs protegit amb token vàlid
it('hauria de permetre accés amb token vàlid', async () => {
const res = await request(app)
.get('/protected')
.set('Authorization', token);

expect(res.statusCode).toEqual(200);
expect(res.text).toContain('Benvingut, usuari');
});

// Test d'accés a recurs protegit amb token invàlid
it("hauria de bloquejar l'accés amb token invàlid", async () => {
const res = await request(app)
.get('/protected')
.set('Authorization', 'Bearer INVALID_TOKEN');

expect(res.statusCode).toEqual(403); // Codi d'error per token invàlid
 });
 });
