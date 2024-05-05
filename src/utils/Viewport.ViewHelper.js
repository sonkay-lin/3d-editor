import { UIPanel } from './libs/ui.js';

import { ViewHelper } from '../../examples/jsm/helpers/ViewHelper.js';

class ViewHelper extends ViewHelper {

	constructor( editorCamera, container ) {

		super( editorCamera, container );

		// const panel = new UIPanel();
		panel.setId( 'viewHelper' );
		panel.setPosition( 'absolute' );
		panel.setRight( '0px' );
		panel.setBottom( '0px' );
		panel.setHeight( '128px' );
		panel.setWidth( '128px' );

    const panel = document.createElement('div')
    panel.setAttribute('id', 'viewHelper')
    panel.setAttribute('class', 'viewHelper')


		panel.dom.addEventListener( 'pointerup', ( event ) => {

			event.stopPropagation();

			this.handleClick( event );

		} );

		panel.dom.addEventListener( 'pointerdown', function ( event ) {

			event.stopPropagation();

		} );

		container.add( panel );

	}

}

export { ViewHelper };
