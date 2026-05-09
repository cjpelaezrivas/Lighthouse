---
title: Include configuration from nested YAML
external_config_0: "{{i _include/external_config/external_config_0.yml}}"
external_config: "{{i _include/external_config/external_config_1.yaml}}"
external_config_2_name: "external_config_2.yml"
external_config_2: "{{i _include/external_config/{{external_config_2_name}}}}"
---

# {{title}}

Getting variable values from external YAML config files:

- {{external_config.key_1}}
- {{external_config.subconfig.key_1_1}}
- {{external_config.subconfig.key_1_2}}
- {{external_config.key_2}}
- {{external_config_2.key_3}}
- {{external_config_2.key_4}}

Success - Variables set before using can be found:

- {{external_config.subconfig.key_1_3}}

Error - Variables used before setting can not be found:

- {{external_config.subconfig.key_1_4}}

Including YAML file as String:

{{i _include/external_config/external_config_1.yaml}}

_Note: Notice it finds `external_config.subconfig.key_1_4` here, because the tag is replaced after configuration was processed_