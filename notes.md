npx create next-app@latest
npx shadcn@latest init

https://tweakcn.com/

run landing.md









templates {
    edges {
      node {
        name
        code
        id
        category
        description
      }
    }
  }

templateDeploy(
    input: {services: {id: "cbd899ff-afca-4b14-a4f1-fc467831bd87", serviceName: "test1", template: "Abo1zu"}, projectId: "422f99a8-c499-49b8-bea3-b6d87e76315b", environmentId: "f3435432-dc8c-4e6f-9dc8-1e26695bf735", workspaceId: "711bc43f-6400-4530-ab49-7da1ab1da13f"}
  ) {
    workflowId
  }

mutation MyMutation2 {
  templateDeployV2(
    input: {
        "serializedConfig": {
        "services": {
          "67cb74a4-319e-4f8f-aca6-57a402e088de": {
            "name": "nodejs",
            "build": {},
            "deploy": {},
            "source": {
              "repo": "https://github.com/alphasecio/nodejs"
            },
            "variables": {
              "PORT": {
                "isOptional": true,
                "defaultValue": "3000"
              }
            },
            "networking": {
              "tcpProxies": {},
              "serviceDomains": {
                "<hasDomain>": {}
              }
            },
            "volumeMounts": {}
          }
        }
      }, 
        templateId: "89d35db4-3f3d-4317-aa47-ad53ccbbf587", workspaceId: "711bc43f-6400-4530-ab49-7da1ab1da13f"}
  ) {
    workflowId
  }
}


operationName
: 
"workspaceTemplates"
query
: 
"query workspaceTemplates($workspaceId: String!) {\n  workspaceTemplates(workspaceId: $workspaceId) {\n    edges {\n      node {\n        ...UserTemplateFields\n      }\n    }\n  }\n}\n\nfragment UserTemplateFields on Template {\n  ...TemplateFields\n  activeProjects\n  totalPayout\n}\n\nfragment TemplateFields on Template {\n  ...TemplateMetadataFields\n  id\n  code\n  createdAt\n  demoProjectId\n  workspaceId\n  serializedConfig\n  canvasConfig\n  status\n  isApproved\n  isVerified\n  communityThreadSlug\n  isV2Template\n  health\n  projects\n  recentProjects\n}\n\nfragment TemplateMetadataFields on Template {\n  name\n  description\n  image\n  category\n  readme\n  tags\n  languages\n  guides {\n    post\n    video\n  }\n}"
variables
: 
{workspaceId: "711bc43f-6400-4530-ab49-7da1ab1da13f"}
workspaceId
: 
"711bc43f-6400-4530-ab49-7da1ab1da13f"



operationName
: 
"marketplace"
query
: 
"query marketplace {\n  templates {\n    edges {\n      node {\n        ...MarketplaceTemplateFields\n      }\n    }\n  }\n}\n\nfragment MarketplaceTemplateFields on Template {\n  ...MarketplaceTemplateMetadataFields\n  id\n  createdAt\n  code\n  isApproved\n  isVerified\n  demoProjectId\n  workspaceId\n  projects\n  recentProjects\n  health\n  creator {\n    ...TemplateCreatorFields\n  }\n}\n\nfragment MarketplaceTemplateMetadataFields on Template {\n  name\n  description\n  image\n  category\n  tags\n}\n\nfragment TemplateCreatorFields on TemplateCreator {\n  name\n  avatar\n  username\n  hasPublicProfile\n}"


operationName
: 
"template"
query
: 
"query template($owner: String, $repo: String, $code: String, $id: String) {\n  template(owner: $owner, repo: $repo, code: $code, id: $id) {\n    ...TemplateFields\n  }\n}\n\nfragment TemplateFields on Template {\n  ...TemplateMetadataFields\n  id\n  code\n  createdAt\n  demoProjectId\n  workspaceId\n  serializedConfig\n  canvasConfig\n  status\n  isApproved\n  isVerified\n  communityThreadSlug\n  isV2Template\n  health\n  projects\n  recentProjects\n}\n\nfragment TemplateMetadataFields on Template {\n  name\n  description\n  image\n  category\n  readme\n  tags\n  languages\n  guides {\n    post\n    video\n  }\n}"
variables
: 
{code: "Abo1zu"}


operationName
: 
"gitHubRepoAccessAvailable"
query
: 
"query gitHubRepoAccessAvailable($fullRepoName: String!) {\n  gitHubRepoAccessAvailable(fullRepoName: $fullRepoName) {\n    hasAccess\n    isPublic\n  }\n}"
variables
: 
{fullRepoName: "alphasecio/nodejs"}




{"query":"mutation templateDeployV2($input: TemplateDeployV2Input!) {\n  templateDeployV2(input: $input) {\n    projectId\n    workflowId\n  }\n}","variables":{"input":{"projectId":"422f99a8-c499-49b8-bea3-b6d87e76315b","workspaceId":"711bc43f-6400-4530-ab49-7da1ab1da13f","environmentId":"f3435432-dc8c-4e6f-9dc8-1e26695bf735","templateId":"89d35db4-3f3d-4317-aa47-ad53ccbbf587","serializedConfig":{"services":{"67cb74a4-319e-4f8f-aca6-57a402e088de":{"name":"nodejs","build":{},"deploy":{},"source":{"repo":"https://github.com/alphasecio/nodejs"},"variables":{"PORT":{"isOptional":true,"defaultValue":"3000"}},"networking":{"tcpProxies":{},"serviceDomains":{"<hasDomain>":{}}},"volumeMounts":{}}}},"groupId":null}},"operationName":"templateDeployV2"}


{"query":"query workflowStatus($workflowId: String!) {\n  workflowStatus(workflowId: $workflowId) {\n    status\n    error\n  }\n}","variables":{"workflowId":"deployTemplate/project/422f99a8-c499-49b8-bea3-b6d87e76315b/WnJpvB"},"operationName":"workflowStatus"}


{"query":"query project($id: String!) {\n  project(id: $id) {\n    ...ProjectFields\n  }\n}\n\nfragment ProjectFields on Project {\n  id\n  name\n  description\n  createdAt\n  updatedAt\n  expiredAt\n  deletedAt\n  prDeploys\n  botPrEnvironments\n  isTempProject\n  isPublic\n  subscriptionType\n  subscriptionPlanLimit\n  workspaceId\n  baseEnvironmentId\n  billingPeriod {\n    start\n    end\n  }\n  projectPermissions {\n    edges {\n      node {\n        ...ProjectPermissionFields\n      }\n    }\n  }\n  environments {\n    edges {\n      node {\n        ...EnvironmentFields\n      }\n    }\n  }\n  services {\n    edges {\n      node {\n        ...ServiceFields\n      }\n    }\n  }\n  volumes {\n    edges {\n      node {\n        ...VolumeFields\n      }\n    }\n  }\n  buckets {\n    edges {\n      node {\n        ...BucketFields\n      }\n    }\n  }\n}\n\nfragment ProjectPermissionFields on ProjectPermission {\n  role\n  userId\n  projectId\n}\n\nfragment EnvironmentFields on Environment {\n  id\n  name\n  projectId\n  createdAt\n  isEphemeral\n  meta {\n    prNumber\n    prTitle\n    prRepo\n    branch\n    baseBranch\n  }\n}\n\nfragment ServiceFields on Service {\n  id\n  name\n  icon\n  templateServiceId\n  createdAt\n  projectId\n  featureFlags\n  templateThreadSlug\n}\n\nfragment VolumeFields on Volume {\n  id\n  createdAt\n  name\n  projectId\n}\n\nfragment BucketFields on Bucket {\n  id\n  createdAt\n  name\n  projectId\n}","variables":{"id":"422f99a8-c499-49b8-bea3-b6d87e76315b"},"operationName":"project"}

