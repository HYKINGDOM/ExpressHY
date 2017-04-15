package com.stardust.express.bo;

import java.util.List;

import com.stardust.express.dao.implementations.Selection;
import com.stardust.express.models.DataModel;

public interface IAdminBO {
    List<DataModel> filter(List<String> colums, List<Object> values, String sortBy, int pageSize, int page);
    List<DataModel> filter(String searchBy, String searchValue, String sortBy, int pageSize, int page);
    DataModel get(long id);
    DataModel get(String key);
    long remove(DataModel model);
    long remove();
    DataModel update(DataModel model);
    DataModel update();
    int count(String searchBy, String searchValue);
    List<DataModel> filter(List<Selection> selections, String sortBy, int pageSize, int page);
    int count(List<Selection> selections);
}
