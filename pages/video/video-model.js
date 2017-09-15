import { Base } from '../../utils/base.js';

class Video extends Base {
    constructor() {
        super();
    }


    /*获取当前视频详情*/
    getVideoInfo(id, callback) {
        var param = {
            url: 'video/' + id,
            sCallback: function (data) {
                callback && callback(data);
            }
        };
        this.request(param);
    }

}
export { Video}