import React, {useEffect, useState} from 'react';
import {authRole, RoutePermittedRole} from 'shared/constants/AppConst';
import {Navigate} from 'react-router-dom';
import {checkPermission} from './helper/RouteHelper';
import {useSelector} from 'react-redux';

/**
 * @param {Object} structure - The passed object that defines the routes.
 * @param {boolean} structure.isAuthenticated - [Required] in order to differentiate between LoggedIn/Loggedout users
 * @param {string} structure.userRole - [Optional] in order to differentiate between admin and normal users
 * @param {object} [structure.anonymousStructure] - it's an object that has only [ routes ] array, [ these routes available for All personas ]
 * @param {object} [structure.authorizedStructure] - it's an object that has [ fallbackPath: {string}, routes: {array} ], fallbackPath: is used for redirect when a logged [in] user tried to access unAuthorized route, routes: only The Logged [in] Routes Available
 * @param {object} [structure.unAuthorizedStructure] - it's an object that has [ fallbackPath: {string}, routes: {array} ], fallbackPath: is used for redirect when a logged [out] user tried to access route that requires [Authorization] , routes: only The Logged [out] Routes Available
 * @param {component} [structure.component fallbackComponent] - in order to redirect in all cases if the route doesn't match.
 * @param {unAuthorizedComponent} [structure.unAuthorizedComponent] - in order to show not permitted route.
 * @returns {Array}
 */

const generateRoutes = (structure) => {
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const {
    isAuthenticated = false,
    anonymousStructure = {},
    authorizedStructure = {},
    unAuthorizedStructure = {},
    userRole = authRole.user,
  } = structure || {};

  const dynamicRoutes = [];

  if (anonymousStructure) {
    dynamicRoutes.push(
      ...routesGenerator(
        isAuthenticated,
        anonymousStructure,
        'anonymous',
        null,
        permissionCheck,
      ),
    );
  }

  if (authorizedStructure) {
    dynamicRoutes.push(
      ...routesGenerator(
        isAuthenticated,
        authorizedStructure,
        'authorized',
        isAuthenticated ? userRole : null,
        permissionCheck,
      ),
    );
  }

  if (unAuthorizedStructure) {
    dynamicRoutes.push(
      ...routesGenerator(
        isAuthenticated,
        unAuthorizedStructure,
        'unAuthorized',
      ),
    );
  }
  return dynamicRoutes;
};

/**
 * path: string
 * component: React.Component
 * routeProps: Object -----> To override route props
 * userRole: string -----> To override route props
 * redirectPath: String ----> To redirect to specific location
 * showRouteIf: to override when to show the component or when to [ Navigate ]
 */
const routesGenerator = (
  isAuthenticated = false,
  routeSet = {},
  type = 'anonymous',
  userRole,
  permissionCheck,
) => {
  const generatedRoutes = [];
  const {fallbackPath = ''} = routeSet || {};

  const isAnonymous = type === 'anonymous';
  const isAuthorized = type === 'authorized';

  if (routeSet?.routes) {
    const {routes} = routeSet;
    if (Array.isArray(routes) && routes.length > 0) {
      routes.forEach((route /* index */) => {
        const {
          path = '',
          permittedRole = RoutePermittedRole.Admin,
          // routeProps = {},
          redirectPath = '',
          showRouteIf = true,
          module,
          submodule,
          action,
        } = route || {};

        // let module = route?.module;
        // let submodule = route?.submodule;
        // let action = route?.action;
        // Show Route only [ in The list ] if this prop is true
        if (showRouteIf) {
          // check the mandatory props for a routes
          if (!path) {
          } else {
            if (isAnonymous) {
              return generatedRoutes.push(route);
            }
            if (isAuthorized) {
              const renderCondition = isAuthorized
                ? isAuthenticated
                : !isAuthenticated;
              if (Array.isArray(route.path)) {
                route.path.map((path) => {
                  return generatedRoutes.push(
                    renderCondition
                      ? checkPermission(
                          permittedRole,
                          userRole,
                          permissionCheck,
                          module,
                          submodule,
                          action,
                        )
                        ? {
                            element: route.element,
                            path,
                            permittedRole: route.permittedRole,
                          }
                        : {
                            path,
                            element: routeSet.unAuthorizedComponent,
                          }
                      : {
                          path,
                          element: (
                            <Navigate
                              to={redirectPath || fallbackPath}
                              replace
                            />
                          ),
                        },
                  );
                });
              } else {
                generatedRoutes.push(
                  renderCondition
                    ? checkPermission(
                        permittedRole,
                        userRole,
                        permissionCheck,
                        module,
                        submodule,
                        action,
                      )
                      ? route
                      : {
                          path: route.path,
                          element: routeSet.unAuthorizedComponent,
                        }
                    : {
                        path: route.path,
                        element: (
                          <Navigate to={redirectPath || fallbackPath} replace />
                        ),
                      },
                );
              }
              return generatedRoutes;
            }
            const renderCondition = isAuthorized
              ? isAuthenticated
              : !isAuthenticated;
            if (Array.isArray(route.path)) {
              route.path.map((path) => {
                return generatedRoutes.push(
                  renderCondition
                    ? {
                        element: route.element,
                        path,
                        permittedRole: route.permittedRole,
                      }
                    : {
                        path,
                        element: (
                          <Navigate to={redirectPath || fallbackPath} replace />
                        ),
                      },
                );
              });
            } else {
              generatedRoutes.push(
                renderCondition
                  ? route
                  : {
                      path: route.path,
                      element: (
                        <Navigate to={redirectPath || fallbackPath} replace />
                      ),
                    },
              );
            }
            return generatedRoutes;
          }
        }
      });
    }
  } else {
  }
  return generatedRoutes;
};

export default generateRoutes;
