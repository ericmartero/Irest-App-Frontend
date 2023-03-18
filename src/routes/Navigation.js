import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './routes';
import { map } from 'lodash';

export function Navigation() {
  return (
    <Switch>
      {map(routes, (route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          render={(props) => (
            <route.layout>
              <route.component {...props} />
            </route.layout>
          )}
        />
      ))}
    </Switch>
  )
}
