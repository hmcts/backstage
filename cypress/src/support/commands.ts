/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable jest/no-standalone-expect */
/// <reference types="cypress" />
import 'os';

Cypress.Commands.add('loginAsGuest', () => {
  cy.visit('/', {
    onLoad: (win: Window) =>
      win.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest'),
  });
});

Cypress.Commands.add('getTechDocsShadowRoot', () => {
  cy.get('[data-testid="techdocs-content-shadowroot"]').shadow();
});

Cypress.Commands.add('isNotInViewport', element => {
  cy.get(element).then($el => {
    const bottom = Cypress.config(`viewportHeight`);
    const rect = $el[0].getBoundingClientRect();

    if (bottom) {
      expect(rect.top).to.be.greaterThan(bottom);
      expect(rect.bottom).to.be.greaterThan(bottom);
      expect(rect.top).to.be.greaterThan(bottom);
      expect(rect.bottom).to.be.greaterThan(bottom);
    }
  });
});

Cypress.Commands.add('isInViewport', element => {
  cy.get(element).then($el => {
    const bottom = Cypress.config(`viewportHeight`);
    const rect = $el[0].getBoundingClientRect();

    if (bottom) {
      expect(rect.top).not.to.be.greaterThan(bottom);
      expect(rect.bottom).not.to.be.greaterThan(bottom);
      expect(rect.top).not.to.be.greaterThan(bottom);
      expect(rect.bottom).not.to.be.greaterThan(bottom);
    }
  });
});

Cypress.Commands.add('getTechDocsTableOfContents', () => {
  cy.get('[data-md-component="toc"]');
});

Cypress.Commands.add('getTechDocsNavigation', () => {
  cy.get('[data-md-component="navigation"]');
});

Cypress.Commands.add('mockSockJSNode', () => {
  cy.intercept('GET', '**/sockjs-node/info**', {
    body: {
      websocket: true,
      origins: ['*:*'],
      cookie_needed: false,
      entropy: 2882389500,
    },
  });
});

Cypress.Commands.add('interceptTechDocsAPICalls', () => {
  cy.intercept(
    'GET',
    '**/techdocs/metadata/entity/default/Component/techdocs-e2e-fixture',
  ).as('entityMetadata');

  cy.intercept(
    'GET',
    '**/techdocs/metadata/techdocs/default/Component/techdocs-e2e-fixture',
  ).as('techdocsMetadata');

  cy.intercept(
    'GET',
    '**/techdocs/sync/default/Component/techdocs-e2e-fixture',
  ).as('syncEntity');

  cy.intercept(
    'GET',
    '**/techdocs/static/docs/default/Component/techdocs-e2e-fixture/sub-page-two/index.html',
  ).as('sectionTwoHTML');

  cy.intercept(
    'GET',
    '**/techdocs/static/docs/default/Component/techdocs-e2e-fixture/index.html',
  ).as('homeHTML');
});

Cypress.Commands.add('waitSectionTwoPage', () => {
  cy.wait([
    '@entityMetadata',
    '@syncEntity',
    '@techdocsMetadata',
    '@sectionTwoHTML',
  ]);
});

Cypress.Commands.add('waitHomePage', () => {
  cy.wait(['@entityMetadata', '@syncEntity', '@techdocsMetadata', '@homeHTML']);
});
