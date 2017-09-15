/**
 * Created by jimmy on 17/2/26.
 */

import { Base } from '../../utils/base.js';

class Product extends Base {
    constructor() {
        super();
    }

    getDetailInfo(id, callback) {
        var param = {
            url: 'product/' + id,
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.request(param);
    }

    getProductsData(callback) {
        var param = {
            url: 'product/recent',
            sCallback: function (data) {
                callback && callback(data);
            }
        }
        this.request(param);
    }

    //获取当前分类下推荐商品（商品前5个）
    
};

export { Product }
