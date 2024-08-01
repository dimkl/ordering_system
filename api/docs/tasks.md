# Tasks

## Cleanup

- [ ] Fix `// @ts-expect-error validatedData are added as part of the request validation` type

## Refactoring

- [~] Convert JsonSchema to OpenAPI
  - [ ] users
  - [ ] customers
  - [ ] orders
  - [x] Group endpoints based per resource
- [ ] Add commitlint as pre-commit hook [ref](https://github.com/conventional-changelog/commitlint)
- [ ] Add pre-commit hook to lint code
- [ ] Investigate using turbo repo or an alternative to automate commands and deps
- [ ] Drop customers endpoints as it's not used anywhere

## Production deployment

- [x] Buy domain
- [x] Find deployment platform
- [x] Create GH action to deploy to production
- [x] Create Clerk production application

## Flow

- [ ] Create shop menu
- [x] Find available time_slots filters:
  - [x] capacity
  - [x] section_id
  - [x] \*startDate
  - [x] \*endDate
- [~] available slots
  - [x] capacity
  - [x] section_id
  - [ ] \*startDate
  - [ ] \*endDate
- [ ] products#available
- [ ] populate holidays and use them in shop#isOpen()
- [ ] use productAvailability in products#available
