import merge from 'lodash/merge'


let initialState = []

export default function report(state = initialState, action = {}) {
  switch (action.type) {

    case 'ADD_REPORT_LIST':
      return action.state

    default:
      return state
  }
}

export const getReportList = (state, name) => {
  return state.report
}
