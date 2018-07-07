

module.exports = (function(){
	const LINE_TYPES = {
		NULL_OPERATOR: 'nopnopnop',
		NEW_PAGE: 'NewPage',
		NARRATIVE: 'thIsIssNarraTIVE',
		DRAW_BACKGROUND: 'DrawBackground',
		PLAY_MUSIC: 'PlayMusic',
		STOP_MUSIC: 'StopMusic',
		PLAY_STING: 'PlaySting',
		CHECKPOINT: '--',
		COMMENT: '//',
		SET_ACTIVE_TRANSITION: 'SetActiveTransition',
		HIDE_WINDOW: 'HideWindow',
		SHOW_WINDOW: 'ShowWindow',
		DIALOGUE: 'DiAlOGUeHeRe',
		DRAW_CHARACTER: 'DrawCharacter',
		TRANSITION: 'Transition',
		CLEAR_CHARACTERS: 'ClearCharacters',
		CLEAR_CHARACTER: 'ClearCharacter',
		EXECUTE_FUNCTION: 'ExecuteFunction',
		GOTO: 'Goto',
		WAIT: 'Wait',
		ENABLE_NOVEL_MODE: 'EnableNovelMode',
		DISABLE_NOVEL_MODE: 'DisableNovelMode',
		MAKE_DECISION: 'MakeDecision',
		IF_STATEMENT: 'm22IF',
		SET_FLAG: 'SetFlag',
		LOAD_SCRIPT: 'LoadScript',
		PLAY_VIDEO: 'PlayVideo',
		MOVEMENT_SPEED: 'SetMovementSpeed',
		TEXT_SPEED: 'SetTextSpeed',
		ANIMATION_TYPE: 'SetAnimationType',
		PLAY_SFX_LOOPED: 'PlayLoopedSting',
		STOP_SFX_LOOPED: 'StopLoopedSting',
		NUM_OF_LINETYPES: ''
	};

	return LINE_TYPES;
})();
