# Tasks

## Cleanup

- [ ] Fix `// @ts-expect-error validatedData are added as part of the request validation` type

## Refactoring

- [ ] Convert JsonSchema to OpenAPI

## Production deployment

- [ ] Buy domain
- [x] Find deployment platform
- [ ] Create GH action to deploy to production
- [ ] Create Clerk production application

## Flow

- [ ] Create shop menu
- [ ] Find available time_slots filters:
  - [ ] capacity
  - [ ] section_id
  - [ ] \*startDate
  - [ ] \*endDate
- [~] available slots
  - [x] capacity
  - [x] section_id
  - [ ] \*startDate
  - [ ] \*endDate
- [ ] products#available
- [ ] populate holidays and use them in shop#isOpen()
- [ ] use productAvailability in products#available
