package com.star6ucks.api.controller;

import com.star6ucks.api.model.Item;
import com.star6ucks.api.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ItemController {
	@Autowired
	private ItemService itemService;
	
	@GetMapping("/items")
	public List<Item> getItems() {
		return itemService.getItems(); 
	}

}
