package com.star6ucks.api.service.impl;

import com.star6ucks.api.model.Item;
import com.star6ucks.api.service.ItemService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("itemService")
public class ItemServiceImpl implements ItemService {

	private List<Item> items = new ArrayList<>(); 

	public ItemServiceImpl() {
		items.add(new Item(0, "Item 1"));
		items.add(new Item(1, "Item 2"));
		items.add(new Item(2, "Item 3"));
	}

	@Override
	public List<Item> getItems() {
		return items;
	}

}
