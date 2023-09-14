import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.manifold import MDS


def randNumberCreate(params: list, rand_size: int):
    """
    生成随机数

    rand_size: 数据容量
    number_cnt=100, low=0, high=100, mean=60, numebr_type=int, rand_type=0
    number_cnt: 随机数的数量,
    num_type: 随机数的种类 0整数 1浮点数,
    rand_type: 随机数的种类
    """
    # 随机数种类
    rand_type = params[0]

    if rand_type == 0:
        # 均匀分布

        # 数据类型
        num_type = params[1]
        high = params[2]
        low = params[3]

        res = None
        if num_type == 0:
            res = np.random.randint(low, high, rand_size)
        else:
            res = np.random.rand(100)*(high-low)+low
        return res.tolist()

    else:
        # 正态分布

        # 数据类型
        num_type = params[1]
        high = params[2]
        low = params[3]
        mean = params[4] # 均值
        var = params[5] # 方差

        res = np.random.normal(mean, var, rand_size)
        clipped_res = np.clip(res, low, high) # 限制在上下界的范围内
        if num_type == 0:
            rounded_res = np.round(clipped_res).astype(int)
            return rounded_res.tolist()
        else:
            return clipped_res.tolist()

def AllRandGenerate(params_list: list, rand_size: int):
    """
    所有的随机生成与处理
    """

    all_res = []
    # 生成所有的随机数
    for params in params_list:
        tmp_res = randNumberCreate(params, rand_size)
        all_res.append(tmp_res)

    # 进行数据降维
    mds_origin_data = np.array(all_res).T

    # # 创建一个示例的高维数据矩阵
    # high_dim_data = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

    # 创建MDS对象并执行降维
    mds = MDS(n_components=2, dissimilarity='euclidean', random_state=42)
    low_dim_data = mds.fit_transform(mds_origin_data)

    res = {
        'origin': mds_origin_data.tolist(),
        'lowres': low_dim_data.tolist(),
        'maxTotal': np.max(np.sum(mds_origin_data, axis=1)).tolist(),
        'minTotal': np.min(np.sum(mds_origin_data, axis=1)).tolist(),
        'maxX': np.max(low_dim_data[:, 0]).tolist(),
        'minX': np.min(low_dim_data[:, 0]).tolist(),
        'maxY': np.max(low_dim_data[:, 1]).tolist(),
        'minY': np.min(low_dim_data[:, 1]).tolist()
    }
    return res