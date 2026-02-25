describe('Hola mundo', () => {
    test('suma básica', () => {
        expect(1 + 1).toBe(2);
    });

    test('string contains', () => {
        expect('hola mundo').toContain('hola');
    });
});