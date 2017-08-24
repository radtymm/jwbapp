
import {AsyncStorage} from 'react-native';
    // 获取
    async function _get(key) {
        try {// try catch 捕获异步执行的异常
            var value = await AsyncStorage.getItem(key);
            if (value !== null){
                console.log('_get() success: ' ,value);
            } else {
                console.log('_get() no data');
            }
        } catch (error) {
            console.log('_get() error: ', error.message);
        }
    }

    // 保存
    async function _save(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
        }
    }

    // 删除
    async function _remove(key) {
        console.log('Demo._remove()');
        try {
            await AsyncStorage.removeItem(key);
            console.log('_remove() success');
        } catch (error) {
            console.log('_remove() error: ', error.message);
        }
    }

const storage = {
    get:(key)=>_get(key),
    save:(key, value)=>_save(key, value),
    remove:(key)=>_remove(key),
};

export default storage;
