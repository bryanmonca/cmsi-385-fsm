import DeterministicFiniteStateMachine from './DeterministicFiniteStateMachine';

const tests = {
  divBy3: {
    description: {
      transitions: {
        r0: {
          0: 'r0',
          1: 'r1',
        },
        r1: {
          0: 'r2',
          1: 'r0',
        },
        r2: {
          0: 'r1',
          1: 'r2',
        }
      },
      startState: 'r0',
      acceptStates: ['r0'],
    },

    tests: {
      accepts: [
        '00110',
        '11',
      ],
      rejects: [],
    }
  },
  hasthree1s: {
    description: {
      transitions: {
        zero: {
          0: 'zero',
          1: 'one',
        },
        one: {
          0: 'one',
          1: 'two',
        },
        two: {
          0: 'two',
          1: 'three',
        },
        three: {
          0: 'three',
          1: 'toomany',
        },
        toomany: {
          0: 'toomany',
          1: 'toomany',
        },
      },
      startState: 'zero',
      acceptStates: ['three'],
    },

    tests: {
      accepts: [
        '01110',
        '111',
        '0101010',
      ],
      rejects: [
        '011110',
        '1111',
        '01101010',
      ],
    }
  },
  numzerosDivBy3: {
    description: {
      transitions: {
        zero_count_r0: {
          0: 'zero_count_r1',
          1: 'zero_count_r0',
        },
        zero_count_r1: {
          0: 'zero_count_r2',
          1: 'zero_count_r1',
        },
        zero_count_r2: {
          0: 'zero_count_r0',
          1: 'zero_count_r2',
        }
      },
      startState: 'zero_count_r0',
      acceptStates: ['zero_count_r0'],
    },

    tests: {
      accepts: [
        '00110',
        '11',
        '01000001',
      ],
      rejects: [
        '0001101',
        '110',
        '010000001',
      ],
    }
  },

};

for (let i = 0; i < 20; i++) {
  if (i % 3 === 0) {
    tests.divBy3.tests.accepts.push(i.toString(2));
  } else {
    tests.divBy3.tests.rejects.push(i.toString(2));
  }
}


describe('examples', () => {
  for (const [key, desc] of Object.entries(tests)) {
    describe(key, () => {
      test('transition', () => {
        const { description } = desc;

        const fsm = new DeterministicFiniteStateMachine(description);
        for (const [state, stateTransitions] of Object.entries(description.transitions)) {
          for (const [symbol, nextState] of Object.entries(stateTransitions)) {
            expect(fsm.transition(state, symbol)).toEqual(nextState);
          }
        }
      });
      test('accepts / rejects', () => {
        const { description, tests: { accepts, rejects } } = desc;
        const fsm = new DeterministicFiniteStateMachine(description);

        for (const string of accepts) {
          expect(`${string}: true`).toEqual(`${string}: ${fsm.accepts(string)}`);
        }

        for (const string of rejects) {
          expect(`${string}: false`).toEqual(`${string}: ${fsm.accepts(string)}`);
        }
      });
    });
  }
});
