import DeterministicFiniteStateMachine from './DeterministicFiniteStateMachine';

export const LAMBDA = '';

export default class NonDeterministicFiniteStateMachine extends DeterministicFiniteStateMachine {


 // try to implement it as there is not LAMBDAS, then deal with them 
  /**
   */
  constructor(description) {
    super(description);
  }


  /**
   *
   * @returns a string state name
   */
  transition(state, symbol) {
    if(!this.transitions[state]) return [];
    return this.transitions[state][symbol] || [];
  }

  possibleNextStates(state, symbol) { //every possible state I could go
    const nextStates = new Set();

    for(const startState of this.reachableFromLambda(state)) {//those would be my start states

      for (const nextState of this.transition(startState, symbol)) { // I want get all the posibles states, if I spend my symbol
        nextStates.add(nextState);
      } 
    }

    // if we didn't have that great side effect
    for (const nextState of nextStates) {
      for(const nextStateAfterLambda of this.reachableFromLambda(nextState)) {
        nextStates.add(nextStateAfterLambda);
      }
    }
    //

    return nextStates;
  }

  reachableFromLambda(state, reachable = {}) {
    if(reachable[state]) return; // to prevent cycles
    reachable[state] = true; //then mark it

    for(const nextState of this.transition(state, LAMBDA)) { // to avoid LAMBDA then LAMBDA then LAMBDA...
      this.reachableFromLambda(nextState, reachable);
    }

    return Object.keys(reachable); // use the reachable object to return the states
  }


////potential infinite loop
  accepts(string, state = this.startState) {
    if(string.length == 0 && this.stateAccepted(state)) return true;
    
    const symbol = string.charAt(0); // abcde   a

    //need to do transition recursively
    for (const nextState of this.possibleNextStates(state, symbol)) {
      if (this.accepts(string.substr(1), nextState)) return true;
    }

    return false;
  }
} /// This is working because of a side effect

