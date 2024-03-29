# Release Notes

## [0.1.4](https://github.com/linuxwolf/expecto/compare/v0.1.3...v0.1.4) (2024-01-06)


### Housekeeping

* **ci:** verify title is conventional ([#53](https://github.com/linuxwolf/expecto/issues/53)) ([eb112b7](https://github.com/linuxwolf/expecto/commit/eb112b7abb3aa50ddbddb8898042f50a018c2bf8))
* **deps:** update deno_std to 0.210.0 ([#56](https://github.com/linuxwolf/expecto/issues/56)) ([a69ade0](https://github.com/linuxwolf/expecto/commit/a69ade0586d41053b73c927634eb1647d646d737))

## [0.1.3](https://github.com/linuxwolf/expecto/compare/v0.1.2...v0.1.3) (2023-12-12)


### Housekeeping

* bootstrap releases ([#42](https://github.com/linuxwolf/expecto/issues/42)) ([b1211d0](https://github.com/linuxwolf/expecto/commit/b1211d047c218238ea64803378d56950118e4efc))
* **build:** report coverage ([#50](https://github.com/linuxwolf/expecto/issues/50)) ([853a604](https://github.com/linuxwolf/expecto/commit/853a604acfdfc241415be8e04165bc789a98516b))
* **ci:** remove extra coverage reporter ([#52](https://github.com/linuxwolf/expecto/issues/52)) ([9b168c0](https://github.com/linuxwolf/expecto/commit/9b168c0f34957a95fc2dd07756cbfa9dce8dc44f))
* **deps:** update to deno/std@0.208.0 ([#51](https://github.com/linuxwolf/expecto/issues/51)) ([6c23047](https://github.com/linuxwolf/expecto/commit/6c23047f554b0c1a13500b7a28426a3a1f9a98ee))
* **release:** decouple release PR from rest of builds ([#47](https://github.com/linuxwolf/expecto/issues/47)) ([7bfb63e](https://github.com/linuxwolf/expecto/commit/7bfb63ee3849395eee2fc7f2c27749daca5343ec))
* **release:** give release-please write permissions ([#46](https://github.com/linuxwolf/expecto/issues/46)) ([fb18a1a](https://github.com/linuxwolf/expecto/commit/fb18a1ad17fa35474a590788ad06772ad19831ef))
* **release:** update release preparations ([#44](https://github.com/linuxwolf/expecto/issues/44)) ([8f60bac](https://github.com/linuxwolf/expecto/commit/8f60bac1f4c5df658535d5a0913138f48add41e9))
* **release:** use manifest-based releases ([#45](https://github.com/linuxwolf/expecto/issues/45)) ([2327ab4](https://github.com/linuxwolf/expecto/commit/2327ab4d9946fee00639e8ea6a4bb634537608f9))
* **release:** workflows should have unique names ([#49](https://github.com/linuxwolf/expecto/issues/49)) ([2f1717c](https://github.com/linuxwolf/expecto/commit/2f1717c958254f93f345cd590138c2d088e5c760))

### [0.1.2](https://github.com/linuxwolf/expecto/compare/v0.1.1...v0.1.2) (2023-10-23)


### Housekeeping

* **deps:** update deno/std to 0.204.0 ([#39](https://github.com/linuxwolf/expecto/issues/39)) ([6d7a0fd](https://github.com/linuxwolf/expecto/commit/6d7a0fdf4dbe6d9a6234a9c141bd73212cda279b))
* **release:** Further fixes to release workflows ([#37](https://github.com/linuxwolf/expecto/issues/37)) ([fb604d4](https://github.com/linuxwolf/expecto/commit/fb604d4049b7b8f82e2dc4f7d36e6905f23703f8))
* **release:** further simplify release tagging ([#38](https://github.com/linuxwolf/expecto/issues/38)) ([7871922](https://github.com/linuxwolf/expecto/commit/7871922df78409bd2658357f2e997a189f19d763))
* **release:** give write permissions to release workflow ([#40](https://github.com/linuxwolf/expecto/issues/40)) ([adacb7c](https://github.com/linuxwolf/expecto/commit/adacb7c6b90fb04d1fe9fc146a090f11664e113d))

### [0.1.1](https://github.com/linuxwolf/expecto/compare/v0.1.0...v0.1.1) (2023-04-16)


### Fixes

* **registry** Don't apply mixins more than once ([#35](https://github.com/linuxwolf/expecto/issues/35)) ([9f8ecb3](https://github.com/linuxwolf/expecto/commit/9f8ecb395ee00cc7c4796a22d5d5397899aa3971))
* **release:** Fix typos in release workflows ([#34](https://github.com/linuxwolf/expecto/issues/34)) ([20b645f](https://github.com/linuxwolf/expecto/commit/20b645f736fc9a104bdc713347dff65961e79271))

## [0.1.0](https://github.com/linuxwolf/expecto/compare/v0.0.2...v0.1.0) (2023-02-26)


### Features

* **membership:** Add `empty` check ([#27](https://github.com/linuxwolf/expecto/issues/27)) ([5096b75](https://github.com/linuxwolf/expecto/commit/5096b754697b01e2babe214b35adb11e692da42a))
* **strings:** Add string-specific checks ([#28](https://github.com/linuxwolf/expecto/issues/28)) ([f4b8dad](https://github.com/linuxwolf/expecto/commit/f4b8dad7616577335045e6f18c0140ffb2d3c06c))


### Housekeeping

* **docs:** Clean up documentation to best demonstrate the latest API ([#29](https://github.com/linuxwolf/expecto/issues/29)) ([42e3e83](https://github.com/linuxwolf/expecto/commit/42e3e8395d05855ef1e2af62fab75a612986e69d))
* **docs:** Clean up nits in changelog ([#26](https://github.com/linuxwolf/expecto/issues/26)) ([c198aa1](https://github.com/linuxwolf/expecto/commit/c198aa1cb8837c9dcf9d72172967c765d40af7e2))
* **release:** Set up automatable releases ([#31](https://github.com/linuxwolf/expecto/issues/31)) ([d96233d](https://github.com/linuxwolf/expecto/commit/d96233d61ecc2982e763217a587fded07a60bcbf))


### Fixes

* **api:** Export the `AssertionError` class in use ([#30](https://github.com/linuxwolf/expecto/issues/30)) ([5dff0a0](https://github.com/linuxwolf/expecto/commit/5dff0a03deeac65366f14b0fc62ce7ff6c2b90c2))
* **release:** Fix automatic release tagging ([#32](https://github.com/linuxwolf/expecto/issues/32)) ([618de08](https://github.com/linuxwolf/expecto/commit/618de084e53b93cc1462f3d0d2a2207635dad5d2))

### [0.0.2](https://github.com/linuxwolf/expecto/compare/v0.0.1...v0.0.2) (2023-02-25)


### Features

* **api:** Add aliases for grammatical convenience ([#24](https://github.com/linuxwolf/expecto/issues/24)) ([065575c](https://github.com/linuxwolf/expecto/commit/065575c9c2aba6f3ca365e779c6af902c96ceac3))


### Housekeeping

* **deps:** Upgrade deno.land/std to 0.177.0 ([#23](https://github.com/linuxwolf/expecto/issues/23)) ([dbca77a](https://github.com/linuxwolf/expecto/commit/dbca77aac20cf264aab348ae089e09935d349c4e))

## v0.0.1 (2023-02-23)

Initial public release.
