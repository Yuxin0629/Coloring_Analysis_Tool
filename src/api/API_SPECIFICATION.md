# API 接口规范文档

## 基础信息

- **Base URL**: `http://localhost:5000/api` (开发环境)
- **认证方式**: JWT Token (Header: `Authorization: Bearer {token}`)
- **请求格式**: JSON (`Content-Type: application/json`)
- **响应格式**: JSON

---

## 1. 认证模块 (Auth)

### 1.1 用户登录

**请求信息**
- **Method**: POST
- **URL**: `/auth/login`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| rememberMe | boolean | 否 | 是否记住登录状态 |

**请求示例**
```json
{
  "username": "admin",
  "password": "123456",
  "rememberMe": true
}
```

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userId": "1",
    "username": "admin",
    "loginTime": "2026-03-19T10:00:00Z",
    "expiresAt": 1710832800000
  }
}
```

---

### 1.2 用户登出

**请求信息**
- **Method**: POST
- **URL**: `/auth/logout`

**请求参数**: 无

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

---

### 1.3 获取当前用户信息

**请求信息**
- **Method**: GET
- **URL**: `/auth/current`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "1",
    "username": "admin",
    "avatar": "https://...",
    "role": "admin"
  }
}
```

---

### 1.4 修改密码

**请求信息**
- **Method**: POST
- **URL**: `/auth/change-password`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| oldPassword | string | 是 | 旧密码 |
| newPassword | string | 是 | 新密码 |

**请求示例**
```json
{
  "oldPassword": "123456",
  "newPassword": "newpassword123"
}
```

---

## 2. 分组管理模块 (Group)

### 2.1 获取分组列表

**请求信息**
- **Method**: GET
- **URL**: `/groups`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| year | string/number | 否 | 年份筛选，如 "2025" |
| keyword | string | 否 | 搜索关键词（匹配名称/描述） |

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "小花幼儿园",
        "description": "小花幼儿园所有涂色数据集",
        "createTime": "2025-08-28",
        "year": 2025,
        "datasetCount": 3
      },
      {
        "id": 2,
        "name": "小草幼儿园",
        "description": "小草幼儿园所有涂色数据集",
        "createTime": "2025-08-28",
        "year": 2025,
        "datasetCount": 2
      }
    ],
    "total": 2
  }
}
```

---

### 2.2 创建分组

**请求信息**
- **Method**: POST
- **URL**: `/groups`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 分组名称（2-50字符） |
| description | string | 否 | 分组描述 |
| year | number | 否 | 年份，默认当前年份 |

**请求示例**
```json
{
  "name": "新分组名称",
  "description": "分组描述",
  "year": 2025
}
```

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "分组创建成功",
  "data": {
    "id": 3,
    "name": "新分组名称",
    "description": "分组描述",
    "createTime": "2026-03-19",
    "year": 2025,
    "datasetCount": 0
  }
}
```

---

### 2.3 更新分组

**请求信息**
- **Method**: PUT
- **URL**: `/groups/{id}`

**路径参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 分组ID |

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 分组名称 |
| description | string | 否 | 分组描述 |

**请求示例**
```json
{
  "name": "更新后的名称",
  "description": "更新后的描述"
}
```

---

### 2.4 删除分组

**请求信息**
- **Method**: DELETE
- **URL**: `/groups/{id}`

**路径参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 分组ID |

**说明**: 删除分组会同时删除其下的所有数据集

---

### 2.5 获取分组统计信息

**请求信息**
- **Method**: GET
- **URL**: `/groups/{id}/stats`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "datasetCount": 3,
    "totalImageCount": 150,
    "analysisProjectCount": 2
  }
}
```

---

## 3. 数据集模块 (Dataset)

### 3.1 获取数据集列表

**请求信息**
- **Method**: GET
- **URL**: `/datasets`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| groupId | number | 否 | 分组ID筛选 |
| year | string | 否 | 年份筛选 |
| keyword | string | 否 | 搜索关键词 |
| sortField | string | 否 | 排序字段：createTime/name/imageCount |
| sortOrder | string | 否 | 排序方向：asc/desc |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "春季涂色作品",
        "description": "2025年春季涂色活动",
        "scenario": "课堂活动",
        "imageCount": 50,
        "createTime": "2025-03-15 10:30:00",
        "year": 2025,
        "creator": "张老师",
        "groupIds": [1]
      }
    ],
    "total": 1
  }
}
```

---

### 3.2 创建数据集

**请求信息**
- **Method**: POST
- **URL**: `/datasets`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 数据集名称 |
| description | string | 否 | 描述 |
| scenario | string | 否 | 应用场景 |
| groupIds | number[] | 否 | 所属分组ID列表 |

**请求示例**
```json
{
  "name": "新数据集",
  "description": "数据集描述",
  "scenario": "课堂活动",
  "groupIds": [1]
}
```

---

### 3.3 更新数据集

**请求信息**
- **Method**: PUT
- **URL**: `/datasets/{id}`

---

### 3.4 删除数据集

**请求信息**
- **Method**: DELETE
- **URL**: `/datasets/{id}`

---

### 3.5 批量删除数据集

**请求信息**
- **Method**: POST
- **URL**: `/datasets/batch-delete`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ids | number[] | 是 | 要删除的数据集ID列表 |

**请求示例**
```json
{
  "ids": [1, 2, 3]
}
```

---

### 3.6 获取数据集图片列表

**请求信息**
- **Method**: GET
- **URL**: `/datasets/{id}/images`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "1-1",
      "name": "image_001.jpg",
      "url": "https://.../image_001.jpg",
      "thumbnailUrl": "https://.../thumb_image_001.jpg",
      "uploadTime": "2025-03-15 10:30:00",
      "size": 2097152
    }
  ]
}
```

---

### 3.7 上传图片到数据集

**请求信息**
- **Method**: POST
- **URL**: `/datasets/{id}/images`
- **Content-Type**: `multipart/form-data`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| files | File[] | 是 | 图片文件列表（支持批量） |

**限制**
- 单文件最大: 10MB
- 支持格式: JPG, PNG
- 批量最多: 50个文件

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "uploadedCount": 5,
    "images": [
      {
        "id": "1-6",
        "name": "new_image.jpg",
        "url": "https://.../new_image.jpg"
      }
    ]
  }
}
```

---

### 3.8 删除单张图片

**请求信息**
- **Method**: DELETE
- **URL**: `/datasets/{datasetId}/images/{imageId}`

---

### 3.9 批量删除图片

**请求信息**
- **Method**: POST
- **URL**: `/datasets/{id}/images/batch-delete`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageIds | string[] | 是 | 图片ID列表 |

---

## 4. 分析项目模块 (Analysis)

### 4.1 获取分析项目列表

**请求信息**
- **Method**: GET
- **URL**: `/analysis`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | string | 否 | 状态筛选：not_started/in_progress/completed/failed |
| year | string | 否 | 年份筛选 |
| keyword | string | 否 | 搜索关键词 |
| sortField | string | 否 | createTime/name/status/targetCount |
| sortOrder | string | 否 | asc/desc |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "春季涂色分析",
        "description": "2025年春季涂色作品分析",
        "targetCount": 50,
        "createTime": "2025-03-20 09:00:00",
        "updateTime": "2025-03-20 10:30:00",
        "year": 2025,
        "status": "in_progress",
        "progress": 65,
        "datasetName": "春季涂色作品",
        "datasetCount": 1,
        "creator": "张老师"
      }
    ],
    "total": 1
  }
}
```

---

### 4.2 创建分析项目

**请求信息**
- **Method**: POST
- **URL**: `/analysis`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 项目名称 |
| description | string | 否 | 描述 |
| datasetIds | number[] | 是 | 数据集ID列表 |
| templateId | number/string | 否 | 模板ID |

**请求示例**
```json
{
  "name": "新分析项目",
  "description": "项目描述",
  "datasetIds": [1, 2],
  "templateId": 1
}
```

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "项目创建成功",
  "data": {
    "id": 2,
    "name": "新分析项目",
    "status": "not_started",
    "progress": 0,
    "createTime": "2026-03-19 10:00:00"
  }
}
```

---

### 4.3 获取项目详情

**请求信息**
- **Method**: GET
- **URL**: `/analysis/{id}`

---

### 4.4 更新项目信息

**请求信息**
- **Method**: PUT
- **URL**: `/analysis/{id}`

---

### 4.5 删除项目

**请求信息**
- **Method**: DELETE
- **URL**: `/analysis/{id}`

---

### 4.6 批量删除项目

**请求信息**
- **Method**: POST
- **URL**: `/analysis/batch-delete`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ids | number[] | 是 | 项目ID列表 |

---

### 4.7 重新分析项目

**请求信息**
- **Method**: POST
- **URL**: `/analysis/{id}/restart`

**说明**: 清空之前的分析结果，重新开始分析任务

---

### 4.8 获取项目分析进度

**请求信息**
- **Method**: GET
- **URL**: `/analysis/{id}/progress`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "projectId": 1,
    "status": "in_progress",
    "progress": 65,
    "currentImage": "image_025.jpg",
    "processedCount": 32,
    "totalCount": 50,
    "estimatedTimeRemaining": 120
  }
}
```

---

### 4.9 保存分析配置（步骤4）

**请求信息**
- **Method**: POST
- **URL**: `/analysis/{id}/config`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageAnalysisConfig | object | 是 | 图片分析配置 |

**请求示例**
```json
{
  "imageAnalysisConfig": {
    "image-1": {
      "region-1": ["color_usage", "coverage_rate"],
      "region-2": ["line_thickness"]
    },
    "image-2": {
      "region-1": ["all"]
    }
  }
}
```

---

### 4.10 提交分析任务

**请求信息**
- **Method**: POST
- **URL**: `/analysis/{id}/submit`

**说明**: 完成所有配置后，提交开始分析任务

---

### 4.11 保存未完成项目草稿

**请求信息**
- **Method**: POST
- **URL**: `/analysis/save-draft`

**请求参数**: 完整的项目临时数据（包括步骤1-4的所有信息）

---

### 4.12 恢复未完成项目

**请求信息**
- **Method**: GET
- **URL**: `/analysis/restore/{id}`

**说明**: 获取之前保存的未完成项目数据，用于断点续传

---

## 5. 模板管理模块 (Template)

### 5.1 获取模板列表

**请求信息**
- **Method**: GET
- **URL**: `/templates`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "精细动作能力分析模板",
        "description": "评估儿童涂色过程中精细动作控制能力",
        "uploadTime": "2025-03-10 14:30:00",
        "uploadBy": "张老师",
        "templateImage": "https://.../template.png",
        "analysisMethods": [
          {
            "name": "线条粗细",
            "enabled": true,
            "description": "检测涂色线条的粗细均匀程度"
          }
        ]
      }
    ],
    "total": 1
  }
}
```

---

### 5.2 上传新模板

**请求信息**
- **Method**: POST
- **URL**: `/templates`
- **Content-Type**: `multipart/form-data`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 模板名称 |
| description | string | 否 | 模板描述 |
| templateImage | File | 是 | 模板图片文件 |
| analysisMethods | string | 否 | 分析方法JSON字符串 |

---

### 5.3 更新模板信息

**请求信息**
- **Method**: PUT
- **URL**: `/templates/{id}`

---

### 5.4 删除模板

**请求信息**
- **Method**: DELETE
- **URL**: `/templates/{id}`

---

### 5.5 批量删除模板

**请求信息**
- **Method**: POST
- **URL**: `/templates/batch-delete`

---

## 6. 图像处理工具模块 (Tool)

### 6.1 执行边缘检测

**请求信息**
- **Method**: POST
- **URL**: `/tools/edge-detect`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageUrl | string | 是 | 图片URL或Base64 |
| sensitivity | number | 否 | 检测灵敏度 0-100，默认50 |

**请求示例**
```json
{
  "imageUrl": "https://.../image.jpg",
  "sensitivity": 70
}
```

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "检测完成",
  "data": {
    "regions": [
      {
        "regionId": "region-1",
        "name": "区域A",
        "label": "1",
        "color": "#1890ff",
        "polygon": [
          {"x": 0.1, "y": 0.1},
          {"x": 0.4, "y": 0.1},
          {"x": 0.4, "y": 0.4},
          {"x": 0.1, "y": 0.4}
        ]
      }
    ]
  }
}
```

---

### 6.2 上传图片并检测边缘

**请求信息**
- **Method**: POST
- **URL**: `/tools/edge-detect/upload`
- **Content-Type**: `multipart/form-data`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image | File | 是 | 图片文件 |
| sensitivity | number | 否 | 检测灵敏度 |

---

### 6.3 保存检测到的区域

**请求信息**
- **Method**: POST
- **URL**: `/tools/edge-detect/regions`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageId | string | 是 | 图片ID |
| regions | array | 是 | 区域列表 |

**请求示例**
```json
{
  "imageId": "1-1",
  "regions": [
    {
      "name": "头部",
      "polygon": [{"x": 0.1, "y": 0.1}, {"x": 0.3, "y": 0.1}, {"x": 0.3, "y": 0.3}],
      "color": "#1890ff"
    }
  ]
}
```

---

### 6.4 透视矫正

**请求信息**
- **Method**: POST
- **URL**: `/tools/correct/perspective`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageUrl | string | 是 | 图片URL |
| referencePoints | array | 是 | 四个参考点坐标 |

**请求示例**
```json
{
  "imageUrl": "https://.../image.jpg",
  "referencePoints": [
    {"x": 100, "y": 100},
    {"x": 400, "y": 100},
    {"x": 400, "y": 400},
    {"x": 100, "y": 400}
  ]
}
```

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "矫正完成",
  "data": {
    "correctedImageUrl": "https://.../corrected_image.jpg",
    "transformation": {
      "type": "perspective",
      "matrix": [...]
    }
  }
}
```

---

### 6.5 旋转矫正

**请求信息**
- **Method**: POST
- **URL**: `/tools/correct/rotation`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageUrl | string | 是 | 图片URL |
| rotation | number | 是 | 旋转角度（度） |

---

### 6.6 缩放调整

**请求信息**
- **Method**: POST
- **URL**: `/tools/correct/scale`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageUrl | string | 是 | 图片URL |
| scale | number | 是 | 缩放比例 |

---

### 6.7 模板自动矫正

**请求信息**
- **Method**: POST
- **URL**: `/tools/correct/auto`

**请求参数（两种方式）**

**方式1 - 使用已上传图片:**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageUrl | string | 是 | 图片URL |
| templateId | number | 是 | 模板ID |

**方式2 - 直接上传图片:**
- **Content-Type**: `multipart/form-data`
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| image | File | 是 | 图片文件 |
| templateId | number | 是 | 模板ID |

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "自动矫正完成",
  "data": {
    "correctedImageUrl": "https://.../corrected.jpg",
    "matchScore": 0.95,
    "appliedTemplate": "标准涂色卡A"
  }
}
```

---

### 6.8 下载矫正后的图片

**请求信息**
- **Method**: GET
- **URL**: `/tools/download`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| url | string | 是 | 矫正后图片的URL |

**响应**: 图片文件流 (blob)

---

## 7. 报告模块 (Report)

### 7.1 获取全局汇总报告

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/summary`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "projectInfo": {
      "id": 1,
      "name": "春季涂色分析",
      "createTime": "2025-03-20",
      "completedTime": "2025-03-20 12:00:00",
      "totalImages": 50
    },
    "summaryStatistics": {
      "totalAnalysisItems": 50,
      "avgColorUsage": 78.5,
      "avgCoverage": 65.2,
      "avgOutOfBounds": 8.3,
      "totalColorCount": 12
    },
    "imageResults": [
      {
        "id": "1-1",
        "name": "image_001.jpg",
        "childName": "小明",
        "analysisTime": "2025-03-20 10:05:00",
        "colorCount": 8,
        "colorUsage": "82%",
        "coverage": "68%",
        "dominantColor": {
          "name": "红色",
          "hex": "#FF4D4F"
        },
        "status": "completed"
      }
    ],
    "colorDistribution": [
      {"name": "红色", "value": 28, "hex": "#FF4D4F"},
      {"name": "蓝色", "value": 22, "hex": "#1890FF"}
    ],
    "regionAnalysis": {
      "regions": [
        {
          "name": "区域A",
          "avgColorUsage": "75%",
          "avgCoverage": "70%"
        }
      ]
    }
  }
}
```

---

### 7.2 获取项目统计信息

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/statistics`

---

### 7.3 导出全局汇总报告

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/export`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| format | string | 是 | 格式：csv/excel/pdf/json |
| type | string | 否 | 类型：summary（默认） |

**响应**: 文件流 (blob)

---

### 7.4 获取单张图片分析报告

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/image/{imageId}`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "imageInfo": {
      "id": "1-1",
      "name": "image_001.jpg",
      "originalImage": "https://.../original.jpg",
      "analysisImage": "https://.../analysis.jpg"
    },
    "basicAnalysis": {
      "colorCount": 8,
      "colorUsage": 82.3,
      "coverage": 68.5,
      "dominantColor": "红色"
    },
    "overallColorDistribution": [
      {"name": "红色", "value": 28, "hex": "#FF4D4F"},
      {"name": "蓝色", "value": 22, "hex": "#1890FF"}
    ],
    "regionAnalysis": {
      "totalRegions": 3,
      "regions": [
        {
          "name": "头部",
          "areaPercentage": 15.2,
          "color": "红色",
          "colorPercentage": 28.5,
          "outOfBoundsRate": 5.2,
          "details": {
            "colorChangeFrequency": 12,
            "penPressure": "medium",
            "edgeAccuracy": 85
          }
        }
      ]
    },
    "areaComparison": {
      "categories": ["目标区域", "实际涂色"],
      "data": [
        {"name": "头部", "目标区域": 15.2, "实际涂色": 12.8}
      ]
    },
    "analysisConfig": {
      "analysisMethods": ["color_usage", "coverage_rate", "out_of_bounds"],
      "regionCount": 3
    }
  }
}
```

---

### 7.5 获取单张图片的区域分析详情

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/image/{imageId}/region/{regionName}`

---

### 7.6 导出单张图片报告

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/image/{imageId}/export`

**请求参数 (Query)**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| format | string | 是 | 格式：pdf/json |

---

### 7.7 批量导出报告

**请求信息**
- **Method**: POST
- **URL**: `/reports/{projectId}/batch-export`

**请求参数**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| imageIds | number[] | 是 | 图片ID列表 |
| format | string | 是 | 导出格式 |

---

### 7.8 获取报告生成状态

**请求信息**
- **Method**: GET
- **URL**: `/reports/{projectId}/status/{taskId}`

**响应示例 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task-123",
    "status": "processing",
    "progress": 45,
    "downloadUrl": null
  }
}
```

---

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 错误响应
```json
{
  "code": 40001,
  "message": "错误描述信息",
  "data": null
}
```

### 常见错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 40001 | 参数缺失或格式错误 |
| 401 | 未授权（Token无效或过期） |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 50001 | 文件处理失败 |

---

## 后端配合要求

### CORS 配置
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

### 文件上传配置
- 支持 `multipart/form-data`
- 单文件大小限制: 10MB
- 批量文件数量限制: 50个

### 认证配置
- JWT Token 有效期: 建议 24 小时
- Token 刷新机制: 支持自动刷新
