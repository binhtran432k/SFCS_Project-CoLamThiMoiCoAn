'use strict'

module.exports = class ErrorHandling {
    static getError (errorNo) {
        let message = null;
        switch (errorNo) {
            case 0:
                break;
            case 1:
                message = 'Đã có lỗi xảy ra, vui lòng thử lại. Nếu tình trạng này xảy ra thường xuyên, hãy báo cáo lên hệ thống';
                break;
            case 2:
                message = 'Mật khẩu hoặc tài khoản không chính xác';
                break;
            case 3:
                message = 'Tài khoản phải từ 8 đến 20 kí tự và chỉ chấp nhận chữ cái và số';
                break;
            case 4:
                message = 'Mật khẩu phải từ 8 đến 20 kí tự và chỉ chấp nhận chữ cái và số';
                break;
            case 5:
                message = 'Hệ thống đang bận vui lòng thử lại sau';
                break;
            case 6:
                message = 'Bạn chưa điền họ và tên';
                break;
            case 7:
                message = 'Email của bạn không hợp lệ';
                break;
            case 8:
                message = 'Mật khẩu nhập vào không đồng nhất';
                break;
            case 9:
                message = 'Bạn phải đăng nhập để sử dụng dịch vụ này';
                break;
            case 10:
                message = 'Tài khoản này đã có người sử dụng';
                break;
            case 11:
                message = 'Giá trị nhập vào phải là số';
                break;
            case 12:
                message = 'Giá trị nhập vào phải là số từ 1 đến 99';
                break;
            case 13:
                message = 'Chỉ có tài khoản loại khách hàng mới có chức năng này';
                break;
            case 14:
                message = 'Chỉ có tài khoản loại đầu bếp mới có chức năng này';
                break;
            case 15:
                message = 'Chỉ có tài khoản loại chủ cửa hàng mới có chức năng này';
                break;
            case 16:
                message = 'Chỉ có tài khoản loại quản lý mới có chức năng này';
                break;
            case 17:
                message = 'Chỉ có tài khoản loại tiếp tân mới có chức năng này';
                break;
            default:
                message = 'Lỗi không xác định';
        }
        return message;
    }
}