package com.stardust.express.tools;

/**
 * Created by Sylar on 15/5/13.
 */
public class ResponseObject<T> {

    private boolean success;
    private String message;
    private T data;


    private ResponseObject(Builder builder) {
        data = (T) builder._data;
        message = builder._message;
        success = builder._success;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public static class Builder {
        private boolean _success;
        private String _message;
        private Object _data;

        public Builder setData(Object data) {
            this._data = data;
            return this;
        }

        public Builder setMessage(String message) {
            this._message = message;
            return this;
        }

        public Builder setSuccess(Boolean success) {
            this._success = success;
            return this;
        }

        public ResponseObject build() {
            return new ResponseObject(this);
        }
    }
}
