[![Prettier code style](https://img.shields.io/badge/code_style-prettier+custom-brightgreen.svg)](https://standardjs.com)
![Package latest version](https://img.shields.io/npm/v/@deeptrace/commons/latest.svg?label=%40deeptrace%2Fcommons)
![Required node version](https://img.shields.io/node/v/@deeptrace/commons.svg?style=flat)
![Supported types](https://img.shields.io/npm/types/@deeptrace/commons.svg)

# @deeptrace/commons

A package with objects shared accross projects.

You can learn more about the "why"s behind this package and DeepTrace's ecosystem [here](https://app.gitbook.com/@deeptrace/s/docs/js-packages/deeptrace-commons).


## How to install

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com).

Installation is done using the npm install command:

```sh
npm install @deeptrace/commons
```


## Exported objects

- CommonError
- DomainError
- InfrastructureError
- HttpError
- UserFaultHttpError
- BadRequestHttpError
- UnauthorizedHttpError
- PaymentRequiredHttpError
- ForbiddenHttpError
- NotFoundHttpError
- ConflictHttpError
- GoneHttpError
- UnprocessableEntityHttpError
- LockedHttpError
- TooManyRequestsHttpError
- ServerFaultHttpError
- InternalServerErrorHttpError
- ServiceUnavailableHttpError
- environments
    - TEST
    - REVIEW
    - STAGING
    - PRODUCTION
    - DEVELOPMENT


## Errors inheritance tree

- CommonError
    - DomainError
    - InfrastructureError
        - HttpError
            - UserFaultHttpError **4xx**
                - BadRequestHttpError **400**
                - UnauthorizedHttpError **401**
                - PaymentRequiredHttpError **402**
                - ForbiddenHttpError **403**
                - NotFoundHttpError **404**
                - ConflictHttpError **409**
                - GoneHttpError **410**
                - UnprocessableEntityHttpError **422**
                - LockedHttpError **423**
                - TooManyRequestsHttpError **429**
            - ServerFaultHttpError **5xx**
                - InternalServerErrorHttpError **500**
                - ServiceUnavailableHttpError **503**
