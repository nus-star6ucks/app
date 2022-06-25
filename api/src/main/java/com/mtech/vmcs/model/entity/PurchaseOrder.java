package com.mtech.vmcs.model.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PurchaseOrder {
    private Long drinkId;
    private List<Coin> coins;
}
