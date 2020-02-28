/* We can do it recursively, blindly, different implementations */

export default class DeterministicFiniteStateMachine {
  /**
   */
  constructor({ transitions, startState, acceptStates }) {
    this.transitions = transitions;
    this.startState = startState;
    this.acceptStates = acceptStates;
  }

  /**
   *  Tells me what the alphabet is, by a given machine
   */
  alphabet() {
      const alphabet = new Set(); // mapping or load-dash

      for(const [key, desc] of Object.entries(this.transitions)) {
          for (const symbol of Object.keys(desc)) {
              alphabet.add(symbol);
          }
      }
  }

  states() {
    return Object.keys(this.transitions);
  }

  stateAccepted(state) {
    return this.acceptStates.includes(state);
  }

  /**
   *
   * @returns a string state name
   */
  transition(state, symbol) {
    return this.transitions[state][symbol];
  }

  accepts(string, state = this.startState) {
    const nextState = this.transition(state, string.charAt(0));
    return (string.length === 0) ? this.stateAccepted(state) :
                                   this.accepts(string.substr(1), nextState);
  }

}

/**
 *
 */
export function cross(dfa1, dfa2, accepts = (dfa1State, dfa2State) => true) {
//.... TODO
  const acceptStates = [];
  const transitions = {};
  
  const alphabet = new Set([...dfa1.alphabet(), ...dfa2.alphabet()]);

  const stateName = (state1, state2) => `m1:${state1}xm2:${state2}`; //name of new state

  const startState = stateName(dfa1.startState, dfa2.startState);

  //list of unresolved states
  const unresolvedStates = [{ state: startState, state1: dfa1.startState, state2: dfa2.startState}];

  while(unresolvedStates.length > 0) {  
      const { state, state1, state2} = unresolvedStates.pop();

      transitions[state] = {};

      if(accepts(state1, state2)) acceptStates.push(state);

      //what state for a given transition
      for(const symbol of alphabet) {
          const nextState1 = dfa1.transition(state1, symbol);
          const nextState2 = dfa2.transition(state2, symbol);

          const nextState = stateName(nextState1, nextState2);
          transitions[state][symbol] = nextState;

          if(!transitions[nextState]) {
              unresolvedStates.push({ state: nextState, state1: nextState1, state2: nextState2});
          }
      }
      
  }


  return new DeterministicFiniteStateMachine({ transitions, startState, acceptStates});
}

export function union(dfa1, dfa2) {
  return cross(dfa1, dfa2, 
   (state1, state2) => dfa1.stateAccepted(state1) || dfa2.stateAccepted(state2));
}

export function intersection(dfa1, dfa2) {
  return cross(dfa1, dfa2, 
   (state1, state2) => dfa1.stateAccepted(state1) && dfa2.stateAccepted(state2));
}

export function minus(dfa1, dfa2) {
  return cross(dfa1, dfa2, 
   (state1, state2) => dfa1.stateAccepted(state1) && !dfa2.stateAccepted(state2));
}