import { wrap } from './expression';

test('wrap() wraps an object as an expression', () => {
  expect(
    wrap({
      testValue1: '1',
      testValue2: '2',
      testValue3: {
        idk: 'yes',
        nested: {
          value: '3',
        },
      },
      testValue4: [2, 5],
    })
  ).toMatchInlineSnapshot(`
      Object {
        "object": Object {
          "testValue1": "1",
          "testValue2": "2",
          "testValue3": Object {
            "object": Object {
              "idk": "yes",
              "nested": Object {
                "object": Object {
                  "value": "3",
                },
              },
            },
          },
          "testValue4": Array [
            2,
            5,
          ],
        },
      }
    `);

  expect(
    wrap({
      testValue: { var: 'testVar' },
      testValue2: { var: 'testVar2' },
      testValue3: { v: { var: 'testVar3' } },
    })
  ).toMatchInlineSnapshot(`
      Object {
        "object": Object {
          "testValue": Object {
            "object": Object {
              "var": "testVar",
            },
          },
          "testValue2": Object {
            "object": Object {
              "var": "testVar2",
            },
          },
          "testValue3": Object {
            "object": Object {
              "v": Object {
                "object": Object {
                  "var": "testVar3",
                },
              },
            },
          },
        },
      }
    `);

  expect(wrap([2, 5, { a: true }])).toMatchInlineSnapshot(`
      Array [
        2,
        5,
        Object {
          "object": Object {
            "a": true,
          },
        },
      ]
    `);
});
