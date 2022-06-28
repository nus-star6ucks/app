package com.mtech.vmcs.model.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
public class PurchaseOrder {
    private Long drinkId;
    private List<Coin> coins;
}
