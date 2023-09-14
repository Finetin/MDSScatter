# MDSS: Multiple Dimensional Scaling to Scatter
- 随机生成四维数据，经过MDS降维处理后转化为二维数据，并呈现在二维平面的坐标系中。
> 运行程序，请下载release中文件[MDSS v1.1.zip](https://github.com/Finetin/MDSScatter/releases/download/v1.1/MDSS.v1.1.zip)
> - 对于前端部分，需要进入前端文件夹目录，执行 `npm install` 下载依赖后，执行 `npm run dev` 即可
> - 对于后端部分，需要进入后端文件夹目录，执行 `python app.py`

## 目录
1. [项目架构](#Title1) &emsp;
2. [程序功能](#Title2) &emsp;
2.1 [数据的生成](#Title2_1) &emsp;
2.2 [散点图](#Title2_2) &emsp;
2.3 [选中数据](#Title2_3) &emsp;

## 项目架构
<span id="Title1"> </span>
- 由前后端共同组成
  - 前端采用vue3框架+ts语言
    - 使用pinia库以进行基础数据的存储
    - 采用了D3.js库呈现二维的散点图
    - 采用了Datatables库以完成选中的展示
  - 后端采用flask框架
    - 随机生成数据并通过MDS降维数据为二维

## 程序功能
<span id="Title2"> </span>
### 数据的生成
<span id="Title2_1"> </span>
- 通过输入框自定义生成数据的情况
  - 比如数据的分布（均与/正态）、数据的上下界等
  - ![1694689391238](https://github.com/Finetin/MDSScatter/assets/112709115/298e44ad-57ab-41e7-9e39-ff0253e5d898)

### 散点图的呈现
<span id="Title2_2"> </span>
- 利用D3.js库展示不同点的位置
  - 不同颜色代表了总分的高低
  - 可单击图中点，以获取该点的各科分数信息
  - ![image](https://github.com/Finetin/MDSScatter/assets/112709115/06adba41-010d-4171-89a8-150acde69e56)

### 选中数据
<span id="Title2_3"> </span>
- 按住鼠标滑动并释放，可在中部散点图选中一块区域
  - 被选中的点将带有红框
  - 被选中点的详细信息在右侧区域呈现
  - ![image](https://github.com/Finetin/MDSScatter/assets/112709115/5a88dd94-b05e-43a7-b64d-5cf8e30d94ba)
