import { Client } from './client';
import { Query } from './query';

const client = new Client({
  secret: process.env.ADMIN_KEY_SECRET!,
});

const q = new Query();

test('echoes raw input', async () => {
  const resource1 = await client.query({ a: true });
  expect(resource1).toMatchInlineSnapshot(`
    Object {
      "a": true,
    }
  `);

  const resource2 = await client.query(4);
  expect(resource2).toMatchInlineSnapshot(`4`);

  const resource3 = await client.query([1, 5, 12]);
  expect(resource3).toMatchInlineSnapshot(`
    Array [
      1,
      5,
      12,
    ]
  `);
});

test('FQL', async () => {
  const resource1 = await client.query(q.Add(100, 10));
  expect(resource1).toMatchInlineSnapshot(`110`);

  const resource2 = await client.query(
    q.Map(
      [['Hen', 'Wen']],
      q.Lambda(['f', 'l'], q.Concat([q.Var('f'), q.Var('l')], ' '))
    )
  );

  expect(resource2).toMatchInlineSnapshot(`
    Array [
      "Hen Wen",
    ]
  `);
});
