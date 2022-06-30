package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.PurchaseOrder;

import java.util.Map;

public interface OrderService {

  Map<String, Object> purchase(PurchaseOrder purchaseOrder);

  void undoPurchase();
}
