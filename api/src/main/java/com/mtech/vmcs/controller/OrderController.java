package com.mtech.vmcs.controller;

import com.mtech.vmcs.model.entity.PurchaseOrder;
import com.mtech.vmcs.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@CrossOrigin
@Controller
@RequestMapping(path = "/orders")
public class OrderController {

  @Autowired private OrderService orderService;

  @PostMapping("/purchase")
  public ResponseEntity<Map<String, Object>> purchase(@RequestBody PurchaseOrder purchaseOrder) {
    return new ResponseEntity<>(orderService.purchase(purchaseOrder), HttpStatus.OK);
  }

  @PostMapping("/purchase/undo")
  public ResponseEntity<PurchaseOrder> undoPurchase() {
    orderService.undoPurchase();
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
