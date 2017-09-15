
import { Base } from '../../utils/base.js';

class Category extends Base {
    constructor() {
        super();
    }
    /*获得某种分类下所有传统商品*/
    getProductsByCategory(id, callback) {
        var param = {
            url: 'product/by_category?id=' + id +'&summary=0',
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.request(param);
    }
    /*获得某种分类下所有预约商品*/
    getTimesByCategory(id, callback) {
        var param = {
            url: 'product/by_category?id=' + id + '&summary=1',
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.request(param);
    }


    //获取某种分类下所有视频
    getVideosByCategory(id, callback) {
        var param = {
            url: 'video/by_category?id=' + id,
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.request(param);
    }

    //获取分类信息
    getProductorData(id, callback) {
        var param = {
            url: 'theme/' + id,
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.request(param);
    }
}

export { Category };