# 导入 Flask
from flask import Flask, jsonify, request, render_template, send_file
from flask_cors import CORS
from dataProcess import *
import os

# __name__代表当前的app.py模块
# 1.出现bug可以帮助快速定位
# 2.对于寻找模板文件有一个相对路径
app = Flask(__name__)
# 配置全局变量

# 配置前端接口
CORS(app)
CORS(app, origins='http://localhost:8080')

# 创建一个路由和视图函数的映射
@app.route("/")
def hello_world():
    return "Hello MDSS!"

@app.route('/api/mdsdata')
def get_scores():
    """
    获取自动生成和MDS降维的数据
    """
    aParams = eval(request.args.get('aParams'))
    bParams = eval(request.args.get('bParams'))
    cParams = eval(request.args.get('cParams'))
    dParams = eval(request.args.get('dParams'))
    print(request.args.get('dataSize'))
    data_size = eval(request.args.get('dataSize'))

    return jsonify(AllRandGenerate([aParams, bParams, cParams, dParams], data_size))


if __name__ == '__main__':
    app.run()