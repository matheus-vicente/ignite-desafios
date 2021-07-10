import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';

export function Routes() {
  <Switch>
    <Route path="/" exact component={Dashboard} />
  </Switch>
}
