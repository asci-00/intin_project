import React, { Component, Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

const Dashboard = lazy(() => import('./dashboard/Dashboard'))
const Treatment = lazy(() => import('./dashboard/Treatment'))
const Upload = lazy(() => import('./dashboard/Upload'))


export class AppRoutes extends Component {
  render() {
    return (
      <Suspense fallback=''>
        <Switch>
          <Route exact path="/">
            <Redirect to="/dashboard"></Redirect>
          </Route>
          <Route exact path="/treatment/:id" component={ Treatment } />
          <Route exact path="/treatment" component={ Treatment } />
          <Route exact path="/dashboard" component={ Dashboard } />
          <Route exact path="/upload" component={ Upload } />
          <Route exact path="/upload/:id" component={ Upload } />

        </Switch>
      </Suspense>
    )
  }
}

export default AppRoutes
