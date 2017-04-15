package com.stardust.express.bo;

import com.stardust.express.tools.IViewContext;

abstract public class BusinessObject {
	protected final IViewContext context;
	
	public BusinessObject(final IViewContext context) {
		this.context = context;
	}
}
