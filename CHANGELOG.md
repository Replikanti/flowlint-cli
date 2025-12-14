# Changelog

## 1.0.0 (2025-12-14)


### Features

* **ci:** add AI polish step to release-please workflow ([f7fc5c5](https://github.com/Replikanti/flowlint-cli/commit/f7fc5c50024f2405bc556787dc3c63391688fc17))
* **ci:** add ai release filtering script ([4dc958f](https://github.com/Replikanti/flowlint-cli/commit/4dc958fa11bcb2f94fc121fa485a4d069b6ac61e))
* **ci:** add script to polish release notes with AI ([114d184](https://github.com/Replikanti/flowlint-cli/commit/114d18465fee57ce8ee0a966c12ca03c8b70e16b))
* **ci:** replace simple automerge with AI-assisted release gate ([a84aaae](https://github.com/Replikanti/flowlint-cli/commit/a84aaae3a87657eb6ddd1fabcb7f889036c13c61))
* setup CI/CD split workflows and renovate config ([4f160c7](https://github.com/Replikanti/flowlint-cli/commit/4f160c7f5b3f09561ba3944332d3beff723cf68b))
* setup CI/CD split workflows and renovate config ([8a39883](https://github.com/Replikanti/flowlint-cli/commit/8a3988343af1738010d5076e93e9d3c7643da63a))
* setup release-it for automated releases ([1ea6dd2](https://github.com/Replikanti/flowlint-cli/commit/1ea6dd233a55d2833a2de66cac74d782e55f0cb3))
* setup release-it for automated releases ([94d6d85](https://github.com/Replikanti/flowlint-cli/commit/94d6d85d714e1e44df3e5dadbc724d6c9c38db6f))


### Bug Fixes

* bundle core dependency into cli executable ([de12925](https://github.com/Replikanti/flowlint-cli/commit/de129251561d75273e4babbb560a59aa9628c518))
* bundle core dependency into cli executable ([1c506f8](https://github.com/Replikanti/flowlint-cli/commit/1c506f88e462ad0e620d47a67490e67ad159d2b6))
* **ci:** add checkout step before running polish script ([4be95c7](https://github.com/Replikanti/flowlint-cli/commit/4be95c718dc3840ad9178fb9a77080612a1e6c4e))
* **ci:** force fix commit type for flowlint-core updates to trigger releases ([e3e56bd](https://github.com/Replikanti/flowlint-cli/commit/e3e56bd7b86ee59d0f029030c6d259b2494893e0))
* **ci:** make AI release filter strictly remove chores and ci spam ([9d2a6a5](https://github.com/Replikanti/flowlint-cli/commit/9d2a6a5d9703872acf151ad668c6d8a70a797911))
* **ci:** normalize github actions SHAs to v4.1.7/v4.0.3 ([9486f37](https://github.com/Replikanti/flowlint-cli/commit/9486f37bbefcaa74bdadc8288af5465714b05cb5))
* **ci:** remove invalid bot user from CODEOWNERS ([8345c24](https://github.com/Replikanti/flowlint-cli/commit/8345c24fab743705cad999dda61997e5b80dd042))
* **ci:** revert to action tags to fix download errors ([8d16186](https://github.com/Replikanti/flowlint-cli/commit/8d16186a16f52163cb74700faa0ae2360733b843))
* **ci:** use github app token for auto-approve ([3678397](https://github.com/Replikanti/flowlint-cli/commit/367839709ad13628d7d5fbbe752bdcfaeddbedb6))
* **ci:** use PAT for auto-approve to satisfy code owners ([adb5575](https://github.com/Replikanti/flowlint-cli/commit/adb5575fcc6376f564df6d4f3738ffe5d64f35ff))
* **ci:** use PAT for release auto-approve to enable cascading releases ([07f7f75](https://github.com/Replikanti/flowlint-cli/commit/07f7f758d7f86b96f9362034fa873222649f8870))
* **ci:** use tag v4 for auto-approve-action to fix download error ([5a27b0e](https://github.com/Replikanti/flowlint-cli/commit/5a27b0ef9e2099d4641bc2db9b171f797b49760b))
* **ci:** use valid SHA for create-github-app-token ([bf2995f](https://github.com/Replikanti/flowlint-cli/commit/bf2995ff612a11cf8b0803dd04864e65a4fd54a1))
* **deps:** add @octokit/rest to devDependencies for release polish script ([3d859a2](https://github.com/Replikanti/flowlint-cli/commit/3d859a241ac564e8a9f074891adc06f9e3b892b9))
* **deps:** add openai to devDependencies for release script ([bbb4335](https://github.com/Replikanti/flowlint-cli/commit/bbb4335af661053bd460ba96e054b718e95476cb))
* **deps:** update dependency commander to v14 ([cd957b4](https://github.com/Replikanti/flowlint-cli/commit/cd957b41722717de4b35050e0ef6cda8920450c9))
* **deps:** update dependency commander to v14 ([577366b](https://github.com/Replikanti/flowlint-cli/commit/577366b28f92b8f355632daaa092de097a2aef3a))
* **deps:** update dependency commander to v14 ([f02d7ce](https://github.com/Replikanti/flowlint-cli/commit/f02d7ce931d590654cc8662aca1efc32a80bbfe5))
* **deps:** update dependency commander to v14 ([973f9d6](https://github.com/Replikanti/flowlint-cli/commit/973f9d6b2809fa995a1b0a12605f5ec7b2d76b0a))
* **deps:** update dependency glob to v13 ([7ea71c3](https://github.com/Replikanti/flowlint-cli/commit/7ea71c3dfc10b3162175ddba04e965296d4b8d94))
* **deps:** update dependency glob to v13 ([671322c](https://github.com/Replikanti/flowlint-cli/commit/671322c73958775a34fdb00bd8428b45ff909248))
* **deps:** update dependency picocolors to ^1.1.1 ([659bcfb](https://github.com/Replikanti/flowlint-cli/commit/659bcfbc9f9ac3bbe7153ea695162a3847ab536c))
* **deps:** update dependency picocolors to ^1.1.1 ([bd9c68f](https://github.com/Replikanti/flowlint-cli/commit/bd9c68f620e5ddadcffef2a4b79f274f4686e4e3))
* implement dynamic versioning and bundle dependencies ([f087ec5](https://github.com/Replikanti/flowlint-cli/commit/f087ec506616c61de9b8d87f63f2e96a1f1909b3))
* implement dynamic versioning and bundle dependencies ([49cace4](https://github.com/Replikanti/flowlint-cli/commit/49cace47c3b795479bbc5da0f48efcebb9852ac8))
* restore junit and sarif reporters, bump v0.6.2 ([c614559](https://github.com/Replikanti/flowlint-cli/commit/c61455916f4c72a5c1017424f997928fd756626b))
* **tests:** correct reporter signatures and assertions in unit tests ([d65120a](https://github.com/Replikanti/flowlint-cli/commit/d65120a0be79644b32c8d225cdd0aec63f022220))
* **tests:** correct reporter signatures and assertions in unit tests ([0bfa90c](https://github.com/Replikanti/flowlint-cli/commit/0bfa90cdd0cdad2ae40d04d03d5d4fbba1cac841))
* **types:** fix typescript error in release polish script ([0c6f661](https://github.com/Replikanti/flowlint-cli/commit/0c6f66106adc7aff5143f76890a10556fc060dd3))
* update core dependency to @replikanti/flowlint-core ([472a0bf](https://github.com/Replikanti/flowlint-cli/commit/472a0bf908ba3f9f5929322c65b4bbb1145d1dc3))
* update core dependency to @replikanti/flowlint-core ([4270554](https://github.com/Replikanti/flowlint-cli/commit/4270554c88508ccc6fc99e2c27fbdb1752fdf011))
