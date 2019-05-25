[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# @deeptrace/commons

A package with objects shared accross projects.


## Exported objects:

- Error
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
- environments
    - TEST
    - REVIEW
    - STAGING
    - PRODUCTION
    - DEVELOPMENT
