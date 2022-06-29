package com.mtech.vmcs.service;

import com.mtech.vmcs.model.entity.PurchaseOrder;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public interface OrderService {

  Map<String, Object> purchase(PurchaseOrder purchaseOrder);

  void undoPurchase();
}
